const web3 = require("@solana/web3.js");
const { Token,createMint,TOKEN_PROGRAM_ID } = require("@solana/spl-token");

(async () => {
  // Connect to cluster
  const connection = new web3.Connection(
    web3.clusterApiUrl("devnet"),
    "confirmed"
  );

  // Generate a new wallet keypair and airdrop SOL
  var fromWallet = web3.Keypair.generate();
  var fromAirdropSignature = await connection.requestAirdrop(
    fromWallet.publicKey,
    web3.LAMPORTS_PER_SOL
  );

  console.log(fromAirdropSignature);
  // Wait for airdrop confirmation
  await connection.confirmTransaction(fromAirdropSignature);

  // Generate a new wallet to receive newly minted token
  const toWallet = web3.Keypair.generate();
console.log(Token);
  // Create new token mint
  const mint = await createMint(
    connection,
    fromWallet,
    fromWallet.publicKey,
    null,
    9,
    TOKEN_PROGRAM_ID
  );
console.log(mint);
  // Get the token account of the fromWallet Solana address, if it does not exist, create it
  const fromTokenAccount = await mint.getOrCreateAssociatedAccountInfo(
    fromWallet.publicKey
  );

  //get the token account of the toWallet Solana address, if it does not exist, create it
  const toTokenAccount = await mint.getOrCreateAssociatedAccountInfo(
    toWallet.publicKey
  );

  // Minting 1 new token to the "fromTokenAccount" account we just returned/created
  await mint.mintTo(
    fromTokenAccount.address,
    fromWallet.publicKey,
    [],
    1000000000
  );

  // Add token transfer instructions to transaction
  const transaction = new web3.Transaction().add(
    splToken.Token.createTransferInstruction(
      splToken.TOKEN_PROGRAM_ID,
      fromTokenAccount.address,
      toTokenAccount.address,
      fromWallet.publicKey,
      [],
      1
    )
  );
console.log(transaction);
  // Sign transaction, broadcast, and confirm
 const signature =  await web3.sendAndConfirmTransaction(connection, transaction, [fromWallet]);
 console.log(signature);
})();