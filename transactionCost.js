const  {
    clusterApiUrl,
    Connection,
    Keypair,
    SystemProgram,
    Transaction,
  } = require("@solana/web3.js");
  
  (async () => {
    // Connect to cluster
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  
    const payer = Keypair.generate();
    const payee = Keypair.generate();
  
    const recentBlockhash = await connection.getLatestBlockhash();
  
    const transaction = new Transaction({
      recentBlockhash: recentBlockhash.blockhash,
    }).add(
      SystemProgram.transfer({
        fromPubkey: payer.publicKey,
        toPubkey: payee.publicKey,
        lamports: 10,
      })
    );
    transaction.feePayer = payer.publicKey
  
    const fees = await transaction.getEstimatedFee(connection);
    console.log(`Estimated SOL transfer cost: ${fees} lamports`);
    // Estimated SOL transfer cost: 5000 lamports
  })();