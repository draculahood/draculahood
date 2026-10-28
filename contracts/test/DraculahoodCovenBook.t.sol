// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {DraculahoodCovenBook} from "../src/DraculahoodCovenBook.sol";

/// Returns a fixed block number from the ArbSys slot, like the real precompile.
contract FakeArbSys {
    fallback(bytes calldata) external returns (bytes memory) {
        return abi.encode(uint256(123_456_789));
    }
}

/// Burns all gas it gets: the book must survive a broken precompile and fall back to block.number.
contract GasEater {
    fallback(bytes calldata) external returns (bytes memory) {
        while (true) {}
        return "";
    }
}

contract DraculahoodCovenBookTest is Test {
    DraculahoodCovenBook book;
    address alice = makeAddr("alice");
    address bob = makeAddr("bob");

    event Joined(address indexed member, uint256 indexed position, string name, uint8 crest, uint64 chainBlock);
    event Updated(address indexed member, uint256 indexed position, string name, uint8 crest, uint32 changes, uint64 chainBlock);

    function setUp() public {
        book = new DraculahoodCovenBook();
        vm.roll(500);
        vm.warp(1_800_000_000);
    }

    function test_join_storesEntryAndEmits() public {
        vm.expectEmit(true, true, false, true);
        emit Joined(alice, 1, "Countess Vale", 3, 500);
        vm.prank(alice);
        uint256 pos = book.join("Countess Vale", 3);
        assertEq(pos, 1);
        DraculahoodCovenBook.Entry memory e = book.entryOf(alice);
        assertEq(e.name, "Countess Vale");
        assertEq(e.crest, 3);
        assertEq(e.changes, 0);
        assertEq(e.joinedAt, 1_800_000_000);
        assertEq(e.joinedBlock, 500);
        assertEq(e.updatedBlock, 500);
        assertTrue(book.isMember(alice));
        assertEq(book.positionOf(alice), 1);
        assertEq(book.memberCount(), 1);
        assertEq(book.crestCounts()[3], 1);
    }

    function test_join_twiceReverts() public {
        vm.startPrank(alice);
        book.join("Vale", 0);
        vm.expectRevert(DraculahoodCovenBook.AlreadyMember.selector);
        book.join("Vale again", 1);
        vm.stopPrank();
    }

    function test_join_rejectsBadCrest() public {
        vm.prank(alice);
        vm.expectRevert(abi.encodeWithSelector(DraculahoodCovenBook.BadCrest.selector, uint8(8)));
        book.join("Vale", 8);
    }

    function test_join_rejectsBadNames() public {
        string[9] memory bad = [
            "",
            " Vale",
            "Vale ",
            "Va  le",
            "Vale\n",
            unicode"Valé",
            "abcdefghijklmnopqrstuvwxy", // 25
            "tab\there",
            string(abi.encodePacked(bytes1(0x7f)))
        ];
        for (uint256 i = 0; i < bad.length; i++) {
            vm.prank(alice);
            vm.expectRevert(DraculahoodCovenBook.BadName.selector);
            book.join(bad[i], 0);
            assertFalse(book.isValid(bad[i], 0));
        }
    }

    function test_join_acceptsEdgeNames() public {
        vm.prank(alice);
        book.join("abcdefghijklmnopqrstuvwx", 7); // exactly 24
        vm.prank(bob);
        book.join("~", 0);
        assertTrue(book.isValid("A b-c_d.e!?~", 2));
        assertEq(book.memberCount(), 2);
        assertEq(book.positionOf(bob), 2);
    }

    function test_update_changesAndCounts() public {
        vm.prank(alice);
        book.join("Vale", 1);
        vm.roll(900);
        vm.warp(1_800_000_100);
        vm.expectEmit(true, true, false, true);
        emit Updated(alice, 1, "Lady Vale", 4, 1, 900);
        vm.prank(alice);
        book.update("Lady Vale", 4);
        DraculahoodCovenBook.Entry memory e = book.entryOf(alice);
        assertEq(e.name, "Lady Vale");
        assertEq(e.crest, 4);
        assertEq(e.changes, 1);
        assertEq(e.joinedBlock, 500);
        assertEq(e.updatedBlock, 900);
        assertEq(e.updatedAt, 1_800_000_100);
        assertEq(book.crestCounts()[1], 0);
        assertEq(book.crestCounts()[4], 1);
        assertEq(book.totalChanges(), 1);
        // name only
        vm.prank(alice);
        book.update("Vale", 4);
        assertEq(book.entryOf(alice).changes, 2);
        assertEq(book.crestCounts()[4], 1);
    }

    function test_update_requiresMembershipAndChange() public {
        vm.prank(alice);
        vm.expectRevert(DraculahoodCovenBook.NotMember.selector);
        book.update("Vale", 1);
        vm.prank(alice);
        book.join("Vale", 1);
        vm.prank(alice);
        vm.expectRevert(DraculahoodCovenBook.NothingChanged.selector);
        book.update("Vale", 1);
        vm.prank(alice);
        vm.expectRevert(DraculahoodCovenBook.BadName.selector);
        book.update(" ", 1);
        vm.prank(alice);
        vm.expectRevert(abi.encodeWithSelector(DraculahoodCovenBook.BadCrest.selector, uint8(200)));
        book.update("Vale", 200);
    }

    function test_members_paginates() public {
        for (uint160 i = 1; i <= 130; i++) {
            vm.prank(address(i * 1000));
            book.join("Night guest", uint8(i % 8));
        }
        (address[] memory w, DraculahoodCovenBook.Entry[] memory e) = book.members(0, 500);
        assertEq(w.length, 100);
        assertEq(e.length, 100);
        assertEq(w[0], address(1000));
        (w, e) = book.members(100, 100);
        assertEq(w.length, 30);
        assertEq(w[29], address(130_000));
        assertEq(e[29].crest, uint8(130 % 8));
        (w,) = book.members(130, 10);
        assertEq(w.length, 0);
        (w,) = book.members(0, 0);
        assertEq(w.length, 0);
        uint256 sum;
        uint256[8] memory c = book.crestCounts();
        for (uint256 i = 0; i < 8; i++) sum += c[i];
        assertEq(sum, 130);
    }

    function test_entryOf_emptyForStranger() public view {
        DraculahoodCovenBook.Entry memory e = book.entryOf(bob);
        assertEq(bytes(e.name).length, 0);
        assertEq(e.joinedAt, 0);
        assertFalse(book.isMember(bob));
        assertEq(book.positionOf(bob), 0);
    }

    function test_rejectsEther() public {
        vm.deal(alice, 1 ether);
        vm.prank(alice);
        (bool ok,) = address(book).call{value: 1}("");
        assertFalse(ok);
        assertEq(address(book).balance, 0);
    }

    function test_chainBlock_readsArbSys() public {
        vm.etch(address(0x64), address(new FakeArbSys()).code);
        assertEq(book.chainBlock(), 123_456_789);
        vm.prank(alice);
        book.join("Vale", 0);
        assertEq(book.entryOf(alice).joinedBlock, 123_456_789);
    }

    function test_chainBlock_survivesBrokenPrecompile() public {
        vm.etch(address(0x64), address(new GasEater()).code);
        vm.prank(alice);
        book.join("Vale", 0);
        assertEq(book.entryOf(alice).joinedBlock, 500);
    }

    function testFuzz_validNameMatchesRule(bytes memory raw, uint8 crest) public {
        vm.assume(raw.length <= 40);
        string memory name = string(raw);
        bool expect = crest < 8 && _ruleOk(raw);
        assertEq(book.isValid(name, crest), expect);
        vm.prank(alice);
        if (!expect) vm.expectRevert();
        book.join(name, crest);
        if (expect) {
            assertEq(book.entryOf(alice).name, name);
            assertEq(book.memberCount(), 1);
        } else {
            assertEq(book.memberCount(), 0);
        }
    }

    function testFuzz_updateKeepsCrestCountsConsistent(uint8[6] memory crests) public {
        vm.prank(alice);
        book.join("Vale", 0);
        uint8 current = 0;
        uint256 changes;
        for (uint256 i = 0; i < crests.length; i++) {
            uint8 c = crests[i] % 8;
            string memory n = i % 2 == 0 ? "Vale" : "Lady Vale";
            DraculahoodCovenBook.Entry memory before = book.entryOf(alice);
            bool same = c == before.crest && keccak256(bytes(n)) == keccak256(bytes(before.name));
            vm.prank(alice);
            if (same) {
                vm.expectRevert(DraculahoodCovenBook.NothingChanged.selector);
                book.update(n, c);
            } else {
                book.update(n, c);
                current = c;
                changes++;
            }
        }
        uint256[8] memory counts = book.crestCounts();
        for (uint8 i = 0; i < 8; i++) assertEq(counts[i], i == current ? 1 : 0);
        assertEq(book.entryOf(alice).changes, changes);
    }

    function _ruleOk(bytes memory b) private pure returns (bool) {
        if (b.length == 0 || b.length > 24) return false;
        if (b[0] == " " || b[b.length - 1] == " ") return false;
        for (uint256 i = 0; i < b.length; i++) {
            if (uint8(b[i]) < 0x20 || uint8(b[i]) > 0x7e) return false;
            if (i > 0 && b[i] == " " && b[i - 1] == " ") return false;
        }
        return true;
    }
}
