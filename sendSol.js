const  {
    Connection,
    Keypair,
    SystemProgram,
    LAMPORTS_PER_SOL,
    Transaction,
    sendAndConfirmTransaction,
  } = require("@solana/web3.js");
  
  (async () => {
    const fromKeypair = Keypair.generate();
    const toKeypair = Keypair.generate();
  
    const connection = new Connection(
      "https://api.devnet.solana.com",
      "confirmed"
    );
  
    const airdropSignature = await connection.requestAirdrop(
      fromKeypair.publicKey,
      LAMPORTS_PER_SOL
    );
  console.log(airdropSignature);
    await connection.confirmTransaction(airdropSignature);
  
    const lamportsToSend = 1_000_000;
  
    const transferTransaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: fromKeypair.publicKey,
        toPubkey: toKeypair.publicKey,
        lamports: lamportsToSend,
      })
    );

    console.log(transferTransaction);
  
  const signature =  await sendAndConfirmTransaction(connection, transferTransaction, [
      fromKeypair,
    ]);
    console.log(signature);
  })();