const {
    clusterApiUrl,
    Connection,
    PublicKey,
    Keypair,
    Transaction,
    SystemProgram,
  } = require("@solana/web3.js");
  const {
    createAssociatedTokenAccount,
    getAssociatedTokenAddress,
    createAssociatedTokenAccountInstruction,
  } = require("@solana/spl-token");
  const bs58 = require("bs58");
  
  (async () => {
    // connection
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  
    // 5YNmS1R9nNSCDzb5a7mMJ1dwK9uHeAAF4CmPEwKgVWr8
    const feePayer = Keypair.fromSecretKey(
      bs58.decode(
        "588FU4PktJWfGfxtzpAAXywSNt74AvtroVzGfKkVN1LwRuvHwKGr851uH8czM5qm4iqLbs1kKoMKtMJG4ATR7Ld2"
      )
    );
  
    // G2FAbFQPFa5qKXCetoFZQEvF9BVvCKbvUZvodpVidnoY
    const alice = Keypair.fromSecretKey(
      bs58.decode(
        "4NMwxzmYj2uvHuq8xoqhY8RXg63KSVJM1DXkpbmkUY7YQWuoyQgFnnzn6yo3CMnqZasnNPNuAT2TLwQsCaKkUddp"
      )
    );
  
    const mintPubkey = new PublicKey(
      "2SKpuBU9ksneBZD4nqbZkw75NE11HsSHsGRtW2BZh5aQ"
    );
  
    // 1) use build-in function
    {
      let ata = await createAssociatedTokenAccount(
        connection, // connection
        feePayer, // fee payer
        mintPubkey, // mint
        alice.publicKey // owner,
      );
      console.log(`ATA: ${ata.toBase58()}`);
    }
  
    // or
  
    // 2) composed by yourself
    {
      // calculate ATA
      let ata = await getAssociatedTokenAddress(
        mintPubkey, // mint
        alice.publicKey // owner
      );
      console.log(`ATA: ${ata.toBase58()}`);
  
      // if your wallet is off-curve, you should use
      // let ata = await getAssociatedTokenAddress(
      //   mintPubkey, // mint
      //   alice.publicKey // owner
      //   true, // allowOwnerOffCurve
      // );
  
      let tx = new Transaction().add(
        createAssociatedTokenAccountInstruction(
          feePayer.publicKey, // payer
          ata, // ata
          alice.publicKey, // owner
          mintPubkey // mint
        )
      );
      console.log(`txhash: ${await connection.sendTransaction(tx, [feePayer])}`);
    }
  })();


  // get token account 

  (async () => {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  
    const tokenAccountPubkey = new PublicKey(
      "2XYiFjmU1pCXmC2QfEAghk6S7UADseupkNQdnRBXszD5"
    );
  
    let tokenAccount = await getAccount(connection, tokenAccountPubkey);
    console.log(tokenAccount);
  });

  // token account balance 
  (async () => {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  
    const tokenAccount = new PublicKey(
      "FWZedVtyKQtP4CXhT7XDnLidRADrJknmZGA2qNjpTPg8"
    );
  
    let tokenAmount = await connection.getTokenAccountBalance(tokenAccount);
    console.log(`amount: ${tokenAmount.value.amount}`);
    console.log(`decimals: ${tokenAmount.value.decimals}`);
  })();