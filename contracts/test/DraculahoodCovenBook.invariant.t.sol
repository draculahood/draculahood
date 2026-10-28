// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {DraculahoodCovenBook} from "../src/DraculahoodCovenBook.sol";

/// Drives random joins and updates from a few wallets and keeps its own tally.
contract CovenHandler is Test {
    DraculahoodCovenBook public book;
    address[5] public actors = [address(0x2001), address(0x2002), address(0x2003), address(0x2004), address(0x2005)];
    string[4] internal names = ["Vale", "Count Ash", "Mina R", "Night-Owl 7"];
    uint256 public joins;
    uint256 public updates;
    mapping(address => uint8) public crestOf;
    mapping(address => bool) public joined;

    constructor(DraculahoodCovenBook b) {
        book = b;
    }

    function join(uint256 who, uint8 crest, uint8 nameSeed) external {
        address a = actors[who % 5];
        crest = crest % 8;
        vm.prank(a);
        if (joined[a]) {
            vm.expectRevert(DraculahoodCovenBook.AlreadyMember.selector);
            book.join(names[nameSeed % 4], crest);
            return;
        }
        book.join(names[nameSeed % 4], crest);
        joined[a] = true;
        crestOf[a] = crest;
        joins++;
    }

    function update(uint256 who, uint8 crest, uint8 nameSeed) external {
        address a = actors[who % 5];
        crest = crest % 8;
        string memory n = names[nameSeed % 4];
        if (!joined[a]) {
            vm.prank(a);
            vm.expectRevert(DraculahoodCovenBook.NotMember.selector);
            book.update(n, crest);
            return;
        }
        DraculahoodCovenBook.Entry memory e = book.entryOf(a);
        if (e.crest == crest && keccak256(bytes(e.name)) == keccak256(bytes(n))) return;
        vm.prank(a);
        book.update(n, crest);
        crestOf[a] = crest;
        updates++;
    }

    function actorAt(uint256 i) external view returns (address) {
        return actors[i];
    }
}

contract DraculahoodCovenBookInvariant is Test {
    DraculahoodCovenBook book;
    CovenHandler handler;

    function setUp() public {
        book = new DraculahoodCovenBook();
        handler = new CovenHandler(book);
        targetContract(address(handler));
    }

    function invariant_memberCountMatchesJoins() public view {
        assertEq(book.memberCount(), handler.joins());
    }

    function invariant_totalChangesMatchesUpdates() public view {
        assertEq(book.totalChanges(), handler.updates());
    }

    function invariant_crestCountsMatchCurrentCrests() public view {
        uint256[8] memory counts = book.crestCounts();
        uint256[8] memory mine;
        for (uint256 i = 0; i < 5; i++) {
            address a = handler.actorAt(i);
            if (handler.joined(a)) mine[handler.crestOf(a)]++;
        }
        for (uint256 i = 0; i < 8; i++) assertEq(counts[i], mine[i]);
    }

    function invariant_positionsAreDenseAndOrdered() public view {
        (address[] memory w, DraculahoodCovenBook.Entry[] memory e) = book.members(0, 100);
        assertEq(w.length, book.memberCount());
        for (uint256 i = 0; i < w.length; i++) {
            assertEq(book.positionOf(w[i]), i + 1);
            assertTrue(e[i].joinedAt != 0);
            assertTrue(book.isValid(e[i].name, e[i].crest));
            assertGe(e[i].updatedBlock, e[i].joinedBlock);
        }
    }

    function invariant_holdsNoEther() public view {
        assertEq(address(book).balance, 0);
    }
}
