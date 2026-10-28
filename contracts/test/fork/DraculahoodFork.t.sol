// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {DraculahoodCovenBook} from "../../src/DraculahoodCovenBook.sol";

/// Fork test against Robinhood Chain mainnet (chain id 4663):
///   forge test --match-path 'test/fork/*' --fork-url https://robinhood.drpc.org --evm-version cancun
/// The book integrates with no other contract; this checks it deploys and records on the real chain state and
/// that its block reading stays sane there.
contract DraculahoodForkTest is Test {
    function setUp() public {
        vm.skip(block.chainid != 4663);
    }

    function test_fork_joinAndUpdate() public {
        DraculahoodCovenBook book = new DraculahoodCovenBook();
        uint64 nowBlock = book.chainBlock();
        assertGt(nowBlock, 0);
        address guest = makeAddr("guest");
        vm.prank(guest);
        book.join("Night guest", 5);
        assertEq(book.entryOf(guest).joinedBlock, nowBlock);
        vm.prank(guest);
        book.update("Night guest II", 2);
        assertEq(book.entryOf(guest).crest, 2);
        assertEq(book.memberCount(), 1);
    }

    function test_fork_chainBlockIsTheChainsOwnBlock() public {
        DraculahoodCovenBook book = new DraculahoodCovenBook();
        // ArbSys is not emulated on a fork; the fallback is the forked block number, the chain's own block.
        assertEq(book.chainBlock(), uint64(block.number));
        assertGt(block.number, 90_000_000);
    }
}
