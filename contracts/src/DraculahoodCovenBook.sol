// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title DraculahoodCovenBook
/// @notice The castle guestbook of Draculahood on Robinhood Chain. A wallet signs the book once with a nickname
///         (1 to 24 printable ASCII characters) and one of eight crests, and may change both later. Everyone can
///         read every entry, in the order wallets first signed.
///         An entry proves only that this wallet chose this nickname and crest at this moment. Nicknames are not
///         unique and not checked against anything: the wallet address is the identity, the nickname is decoration.
/// @dev No owner, no admin, no fee, no pause, no upgrade path, no constructor arguments, no token. The contract never
///      holds funds: no function is payable and there is no receive or fallback, so ETH transfers revert.
///      On Arbitrum-style chains `block.number` reports the parent chain's block, so the chain's own block is read
///      from the ArbSys precompile when it answers, and from `block.number` everywhere else (local tests).
contract DraculahoodCovenBook {
    struct Entry {
        string name;
        uint8 crest;
        uint32 changes;
        uint64 joinedAt;
        uint64 joinedBlock;
        uint64 updatedAt;
        uint64 updatedBlock;
    }

    /// @notice Longest nickname in bytes (every accepted byte is one printable ASCII character).
    uint256 public constant MAX_NAME = 24;
    /// @notice Number of crests. Crest ids run from 0 to CREST_COUNT - 1.
    uint8 public constant CREST_COUNT = 8;
    /// @notice Most entries a paginated read returns at once.
    uint256 public constant MAX_PAGE = 100;

    /// @dev ArbSys precompile. `arbBlockNumber()` returns the chain's own block number.
    address private constant ARB_SYS = address(0x64);
    bytes4 private constant ARB_BLOCK_NUMBER = 0xa3b1b31d;
    /// @dev Gas forwarded to ArbSys. The real precompile needs about a thousand; the cap keeps a chain (or a local
    ///      fork) where 0x64 holds failing code from burning the whole transaction's gas.
    uint256 private constant ARB_SYS_GAS = 30_000;

    /// @notice Number of name or crest changes ever made, across all members.
    uint256 public totalChanges;
    /// @notice How many members carry each crest right now.
    uint256[8] private _crestCount;

    /// @dev Entry per wallet. A wallet is a member when joinedAt != 0.
    mapping(address member => Entry) private _entries;
    /// @dev Members in the order they first signed.
    address[] private _members;
    /// @dev 1-based position of a member in _members (0 = not a member).
    mapping(address member => uint256) private _position;

    event Joined(address indexed member, uint256 indexed position, string name, uint8 crest, uint64 chainBlock);
    event Updated(address indexed member, uint256 indexed position, string name, uint8 crest, uint32 changes, uint64 chainBlock);

    error AlreadyMember();
    error NotMember();
    error BadName();
    error BadCrest(uint8 crest);
    error NothingChanged();

    /// @notice Signs the castle guestbook. One entry per wallet; use `update` to change it later.
    /// @param name 1 to MAX_NAME printable ASCII characters (0x20 to 0x7E), not starting or ending with a space,
    ///        no two spaces in a row.
    /// @param crest 0 to CREST_COUNT - 1.
    function join(string calldata name, uint8 crest) external returns (uint256 position) {
        if (_entries[msg.sender].joinedAt != 0) revert AlreadyMember();
        _check(name, crest);
        uint64 blk = chainBlock();
        _members.push(msg.sender);
        position = _members.length;
        _position[msg.sender] = position;
        Entry storage e = _entries[msg.sender];
        e.name = name;
        e.crest = crest;
        e.joinedAt = uint64(block.timestamp);
        e.joinedBlock = blk;
        e.updatedAt = uint64(block.timestamp);
        e.updatedBlock = blk;
        unchecked {
            _crestCount[crest] += 1;
        }
        emit Joined(msg.sender, position, name, crest, blk);
    }

    /// @notice Changes the sender's nickname and crest. Reverts when neither changes.
    function update(string calldata name, uint8 crest) external {
        Entry storage e = _entries[msg.sender];
        if (e.joinedAt == 0) revert NotMember();
        _check(name, crest);
        if (e.crest == crest && keccak256(bytes(e.name)) == keccak256(bytes(name))) revert NothingChanged();
        uint64 blk = chainBlock();
        if (e.crest != crest) {
            unchecked {
                _crestCount[e.crest] -= 1;
                _crestCount[crest] += 1;
            }
            e.crest = crest;
        }
        e.name = name;
        e.updatedAt = uint64(block.timestamp);
        e.updatedBlock = blk;
        unchecked {
            e.changes += 1;
            totalChanges += 1;
        }
        emit Updated(msg.sender, _position[msg.sender], name, crest, e.changes, blk);
    }

    /// @notice True when `name` and `crest` would be accepted by `join` / `update`.
    function isValid(string calldata name, uint8 crest) external pure returns (bool) {
        return crest < CREST_COUNT && _validName(bytes(name));
    }

    /// @notice Number of members.
    function memberCount() external view returns (uint256) {
        return _members.length;
    }

    /// @notice True when the wallet has signed the book.
    function isMember(address member) external view returns (bool) {
        return _entries[member].joinedAt != 0;
    }

    /// @notice 1-based position of a member in signing order (0 when not a member).
    function positionOf(address member) external view returns (uint256) {
        return _position[member];
    }

    /// @notice One entry (empty when the wallet has not signed).
    function entryOf(address member) external view returns (Entry memory) {
        return _entries[member];
    }

    /// @notice How many members carry each crest right now (index = crest id).
    function crestCounts() external view returns (uint256[8] memory) {
        return _crestCount;
    }

    /// @notice Up to `limit` (max MAX_PAGE) members with their entries, in signing order starting at `offset`.
    function members(uint256 offset, uint256 limit) external view returns (address[] memory wallets, Entry[] memory entries) {
        uint256 n = _members.length;
        if (offset >= n || limit == 0) return (new address[](0), new Entry[](0));
        uint256 count = _min(n - offset, _min(limit, MAX_PAGE));
        wallets = new address[](count);
        entries = new Entry[](count);
        for (uint256 i = 0; i < count; i++) {
            address w = _members[offset + i];
            wallets[i] = w;
            entries[i] = _entries[w];
        }
    }

    /// @notice The chain's current block: ArbSys `arbBlockNumber()` when the precompile answers, else `block.number`.
    function chainBlock() public view returns (uint64) {
        (bool ok, bytes memory ret) = ARB_SYS.staticcall{gas: ARB_SYS_GAS}(abi.encodeWithSelector(ARB_BLOCK_NUMBER));
        if (ok && ret.length == 32) {
            uint256 n = abi.decode(ret, (uint256));
            if (n != 0 && n <= type(uint64).max) return uint64(n);
        }
        return uint64(block.number);
    }

    function _check(string calldata name, uint8 crest) private pure {
        if (crest >= CREST_COUNT) revert BadCrest(crest);
        if (!_validName(bytes(name))) revert BadName();
    }

    /// @dev 1..MAX_NAME bytes, each 0x20..0x7E, no leading/trailing space, no double space.
    function _validName(bytes calldata b) private pure returns (bool) {
        uint256 n = b.length;
        if (n == 0 || n > MAX_NAME) return false;
        if (b[0] == 0x20 || b[n - 1] == 0x20) return false;
        bytes1 prev = 0x00;
        for (uint256 i = 0; i < n; i++) {
            bytes1 c = b[i];
            if (c < 0x20 || c > 0x7e) return false;
            if (c == 0x20 && prev == 0x20) return false;
            prev = c;
        }
        return true;
    }

    function _min(uint256 a, uint256 b) private pure returns (uint256) {
        return a < b ? a : b;
    }
}
