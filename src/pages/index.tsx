import Landing from '../components/Landing';
import QuestionMenu from '../components/QuestionMenu';
import Question from '../components/Question';
import End from '../components/End';
import Tracks from '../components/Tracks';
import axios from 'axios';
import Demo from '../components/Demo'
import Image from 'next/image';
import { useEffect, useState } from "react";
import { SignMessage } from '../components/SignMessage';
import { useSession } from "next-auth/react"
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

interface Questions {
  name: string,
  description: string,
  difficulty: number,
  api: string,
  solved: boolean,
  type: string,
  example_answer: string,
  hints: string[]
  code: string,
  docs: string,
  tags: string[],
}

export default function Home() {
  const [selectedComponent, setSelectedComponent] = useState('Landing')
  const [question, setQuestion] = useState()
  const [progress, setProgress] = useState(0)
  const originalQuestions = [
    {
      name: "Native Balance",
      description: <Demo></Demo>,
      difficulty: 1,
      api: "sol_held",
      solved: false,
      type: "wallet",
      example_answer: "25.01",
      hints: ["As the data returned in the Balances API is returned in terms of Lamports, you'll need to divide by 1 billion for an accurate SOL answer.",
        "You can call the native javascript function of variable.toFixed(0) to round your answer to the nearest SOL, this is necessary for this question.",
        "If you're using the Balances API, the amount of SOL held is contained in the property 'nativeBalance'."],
      code:
        `const url = "https://api.helius.xyz/v0/addresses/<address>/balances?api-key=<api-key>";

const getBalances = async () => {
  const response = await fetch(url);
  const data = await response.json();
  console.log("balances: ", data);
};

getBalances();`,
      docs: "https://docs.helius.xyz/solana-apis/balances-api",
      tags: ["ENHANCED API"]
    },
    {
      name: "Leaves on a Merkle Tree",
      description: "You are provided a cNFT mint address. Make use of Helius' services in order to find the current number of leaves on the merkle tree the cNFT was minted on.",
      difficulty: 1,
      api: "merkle_leaves",
      solved: false,
      type: "cnft",
      example_answer: "12501",
      hints: ["Find the Merkle Tree ID and look it up on https://xray.helius.xyz/.",
        "Call the ConcurrentMerkleTreeAccount function on the Merkle Tree ID",
        "Find the rightMostPath property."],
      code:
`const url = "https://mainnet.helius-rpc.com/?api-key=<api_key>"

const getAsset = async () => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 'my-id',
      method: 'getAsset',
      params: {
        id: Bu1DEKeawy7txbnCEJE4BU3BKLXaNAKCYcHR4XhndGss
      },
    }),
  });
  const { result } = await response.json();
  console.log(result)
};
getAsset()`,
      docs: "https://docs.helius.xyz/solana-compression/digital-asset-standard-das-api/get-asset",
      tags: ["DAS", "CNFT"]
    },
    {
      name: "Size of a Merkle Tree",
      description: "You are provided a cNFT mint address. Make use of Helius' services in order to find the maximum number of leaves on the merkle tree the cNFT was minted on.",
      difficulty: 1,
      api: "max_merkle",
      solved: false,
      type: "cnft",
      example_answer: "8192",
      hints: ["Find the Merkle Tree ID and look it up on https://xray.helius.xyz/.",
        "Call the ConcurrentMerkleTreeAccount function on the Merkle Tree ID",
        "Find the maxDepth property and the size of the tree is 2 to the maxDepth."],
      code:
`const url = "https://mainnet.helius-rpc.com/?api-key=<api_key>"

const getAssetProof = async () => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 'my-id',
      method: 'getAssetProof',
      params: {
        id: 'Bu1DEKeawy7txbnCEJE4BU3BKLXaNAKCYcHR4XhndGss'
      },
    }),
  });
  const { result } = await response.json();
  console.log("Assets Proof: ", result);
};
getAssetProof()`,
      docs: "https://docs.helius.xyz/solana-compression/digital-asset-standard-das-api/get-asset",
      tags: ["DAS", "CNFT"]
    },
    {
      name: "A cNFT's Merkle Tree",
      description: "You are provided a cNFT mint address. Make use of Helius' services in order to find the ID of the merkle tree the cNFT was minted on.",
      difficulty: 1,
      api: "find_merkle",
      solved: false,
      type: "cnft",
      example_answer: "2kuTFCcjbV22wvUmtmgsFR7cas7eZUzAu96jzJUvUcb7",
      hints: ["Read the docs: https://docs.helius.xyz/solana-compression/digital-asset-standard-das-api/get-asset-proof",
        "Find the property by scrolling through the example output in the demo",
        "The property is called, under compression.tree"],
      code:
`const url = "https://mainnet.helius-rpc.com/?api-key=<api_key>"

const getAssetProof = async () => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 'my-id',
      method: 'getAssetProof',
      params: {
        id: 'Bu1DEKeawy7txbnCEJE4BU3BKLXaNAKCYcHR4XhndGss'
      },
    }),
  });
  const { result } = await response.json();
  console.log("Assets Proof: ", result);
};
getAssetProof()`,
      docs: "https://docs.helius.xyz/solana-compression/digital-asset-standard-das-api/get-asset",
      tags: ["DAS", "CNFT"]
    },
    {
      name: "A cNFT's Transactions",
      description: "You are provided a cNFT mint address. Make use of Helius' services in order to find the number of transactions relating to the cNFT.",
      difficulty: 1,
      api: "cnft_sigs",
      solved: false,
      type: "cnft",
      example_answer: "2",
      hints: ["https://docs.helius.xyz/solana-compression/digital-asset-standard-das-api/get-signatures-for-asset"],
      code:
`const url = "https://mainnet.helius-rpc.com/?api-key=<api_key>"

const getSignaturesForAsset = async () => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 'my-id',
      method: 'getSignaturesForAsset',
      params: {
        id: 'FNt6A9Mfnqbwc1tY7uwAguKQ1JcpBrxmhczDgbdJy5AC',
        page: 1, // Starts at 1
        limit: 1000, // Limit 1000 per request.
      },
    }),
  });
  const { result } = await response.json();
  console.log("Signatures: ", result);
};
getSignaturesForAsset();`,
      docs: "https://docs.helius.xyz/solana-compression/digital-asset-standard-das-api/get-signatures-for-asset",
      tags: ["DAS", "CNFT"]
    },
    {
      name: "Number of NFTs Held",
      description: "You are provided a wallet address. Make use of Helius' service to determine the number of NFTs held by the provided wallet.",
      difficulty: 1,
      api: 'nfts_held',
      solved: false,
      type: 'wallet',
      example_answer: "25",
      hints: ["There are multiple ways to determine the number of NFTs held, some options include: using the Balances API, using the more efficient DAS protocol.",
        "Assuming the wallet provided has fewer NFTs than the limit returned in one query, the answer would simply be the length of the returned NFT array.",
        "You can adjust the limit of NFTs returned! For some wallets you may still need to paginate."],
      code:
        `const url = "https://rpc.helius.xyz/?api-key=<api-key>"

const getAssetsByOwner = async () => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 'my-id',
      method: 'getAssetsByOwner',
      params: {
        ownerAddress: '86xCnPeV69n6t3DnyGvkKobf9FdN2H9oiVDdaMpo2MMY',
        page: 1, // Starts at 1
        limit: 1000
      },
    }),
  });
  const { result } = await response.json();
  console.log("Assets by Owner: ", result.items);
};

getAssetsByOwner();`,
      docs: "https://docs.helius.xyz/solana-compression/digital-asset-standard-das-api/get-assets-by-owner",
      tags: ["DAS", "RPC"]
    },
    {
      name: "Image URL of an NFT",
      description: "You are provided the mint address of a token. Make use of Helius' services to find the image of an NFT, you'll need to extract the URL pointing to the image from the data.",
      difficulty: 1,
      api: 'image_nft',
      solved: false,
      type: 'nft',
      example_answer: "https://madlads.s3.us-west-2.amazonaws.com/images/8420.png",
      hints: ["You can log the data returned from the endpoint in order to find out the path that has the URL for the image.",
        "You'll need to log the 1st index, or data[0] if using the token-metadata endpoint as it is returned as an array.",
        "If the link you've provided is not accepted, try querying for the link found in the offChainMetadata property of the data returned."],
      code:
        `const getMetadata = async (context) => {


  const url = "https://api.helius.xyz/v0/token-metadata?api-key=<api-key>=";
  const nftAddresses = [context];

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      mintAccounts: nftAddresses,
      includeOffChain: true,
      disableCache: false,
    }),
  });

  const data = await response.json();
  console.log("metadata: ", data);
};

getMetadata('F9Lw3ki3hJ7PF9HQXsBzoY8GyE6sPoEZZdXJBsTTD2rk');`,
      docs: "https://docs.helius.xyz/solana-apis/token-metadata-api",
      tags: ["DAS", "RPC"]
    },
    {
      name: "Identify an NFT's holder",
      description: "You are provided the mint address of a token. Make use of Helius' services to identify the holder of the provided NFT token address.",
      difficulty: 1,
      api: 'nft_holder',
      solved: false,
      type: 'nft',
      example_answer: "T1d3crwf5cYLcVU5ojNRgJbJUXJta2uBgbtev2xWLAW",
      hints: ["There are multiple ways to determine the owner, the provided boiler plate code here uses DAS, however the NFT Events API is also viable albeit less efficient.",
        "You should log the data, regardless of which method you choose, expanding each property to see what lies within.",
        "If you're using DAS, the path to locate the holder of the NFT is data.result.ownership.owner."],
      code:
        `const url = "https://rpc.helius.xyz/?api-key=<api_key>"

const getAsset = async () => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 'my-id',
      method: 'getAsset',
      params: {
        id: 'F9Lw3ki3hJ7PF9HQXsBzoY8GyE6sPoEZZdXJBsTTD2rk'
      },
    }),
  });
  const { result } = await response.json();
  console.log("Asset: ", result);
};

getAsset();`,
      docs: "https://docs.helius.xyz/solana-compression/digital-asset-standard-das-api/get-asset",
      tags: ["DAS", "RPC"]
    },
    {
      name: "Transaction Epoch",
      description: "You are provided the signature of a transaction. Make use of Helius' services to identify the time at which the provided transaction took place.",
      difficulty: 1,
      api: 'epoch_tx',
      solved: false,
      type: 'tx',
      example_answer: "1633112174",
      hints: ["You can log the data returned from the endpoint in order to find out the path that has the epoch of the transaction.",
        "You'll need to log the 1st index, or data[0] if using the /v0/transactions/ endpoint as it is returned as an array.",
        "If you're using the /v0/transactions/ endpoint, the path to locate the holder of the NFT is data[0].timestamp."],
      code:
        `const url = "https://api.helius.xyz/v0/transactions/?api-key=<your-key>";

const parseTransaction = async () => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      transactions: ["your-txn-id-here"],
    }),
  });

  const data = await response.json();
  console.log("parsed transaction: ", data);
};

parseTransaction()
`,
      docs: "https://docs.helius.xyz/solana-apis/enhanced-transactions-api/parse-transaction-s",
      tags: ["ENHANCED API"]
    },
    {
      name: "First Transaction",
      description: "You are provided a wallet address. Make use of Helius' services in order to retrieve the first transaction signature of the provided wallet.",
      difficulty: 2,
      api: "first_tx",
      solved: false,
      type: "wallet",
      example_answer: "42JQVGf7V6LzAMizHEMk8tJ1HPozrBmB4dCxNgU14CSx8sXLxWau3JsS2NcM8vnDYK2XSXXhnNSVN8zfnBqiqGDd",
      hints: ["There are two endpoints you can use for this question, one being the provided /v0/addresses/<address>/transactions and the other by querying directly through an RPC.",
        "Depending on the wallet provided, you may need to paginate through all their transactions.",
        "If you're using the RPC, a quick way to check would be to use the before and after properties, if no transactions occur before your answer for the transaction, it is the first transaction to take place!"],
      code:
        `const url = "https://api.helius.xyz/v0/addresses/<address>/transactions?api-key=<your-key>";

const parseTransactions = async () => {
  const response = await fetch(url);

  const data = await response.json();

  console.log("parsed transactions: ", data);
};

parseTransactions()
`,
      docs: "https://docs.helius.xyz/solana-apis/enhanced-transactions-api/parsed-transaction-history",
      tags: ["RPC"]
    },
//     {
//       name: "Sale Activity of an NFT",
//       description: "You are provided a token address. Make use of Helius' services in order to find the number of times it has been sold.",
//       difficulty: 1,
//       api: "times_sold",
//       solved: false,
//       type: "nft",
//       example_answer: "5",
//       hints: ["You can use the NFT Events (Historical Querying) to determine the number of times an NFT has been sold, by changing the account to that of the token's mint address.",
//         "Assuming you've applied the NFT_SALE filter, the number of times sold is simply the length of the returned array.",
//         "Fiddle around with the options, e.g sources, types, and other properties found on the Gitbook to get a better understanding of this endpoint."],
//       code:
//         `const getNftEvents = async (context) => {

//   const url = "https://api.helius.xyz/v1/nft-events?api-key=<api-key>"

//   const response = await fetch(url,
//     {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         query: {
//           accounts: [context],
//           types: ["NFT_SALE"],
//         }
//       }),
//     });

//   const data = await response.json()
//   console.log(data)

// };

// getNftEvents("T1d3crwf5cYLcVU5ojNRgJbJUXJta2uBgbtev2xWLAW")`,
//       docs: "https://docs.helius.xyz/solana-apis/nft-api/nft-events-historical-querying",
//       tags: [""]
//     }, deprecated endpoint
  ]
  const [questions, setQuestions] = useState(originalQuestions)
  const [userData, setUserData] = useState()
  const [mintedAward, setMintedAward] = useState(false);
  const sessionData: any = useSession();
  const [completed, setCompleted] = useState([]);
  const [track, setTrack] = useState();

  useEffect(() => {
    async function saveProgress() {
      const { data } = await axios.post(`/api/user_progress`,
        {
          user: sessionData.data.publicKey,
          completed_questions: completed,
          progress: progress,
          minted_award: mintedAward
        });
    }

    if (sessionData?.data?.publicKey) {
      saveProgress()
    }

  }, [completed, mintedAward])


  useEffect(() => {

    function updateQuestions(completed_questions: any) {

      let updatedQuestions = originalQuestions;
      for (let i = 0; i < completed_questions.length; i++) {
        const index = originalQuestions.findIndex((e: any) => e.api === completed_questions[i]);
        if (index !== -1) {
          updatedQuestions.splice(index, 1);
        }
      }
      setQuestions(updatedQuestions)
    }

    async function retrieveProgress() {
      
      const { data } = await axios.post("/api/retrieve_progress",
        {
          user: sessionData?.data?.publicKey
        })
      if (data[0]?.user) {
        setProgress(data[0].progress)
        setCompleted(data[0].completed_questions)
        updateQuestions(data[0].completed_questions)
        setUserData(data[0])
        setMintedAward(data[0].minted_award)
      }
      else {
        setProgress(0)
        setQuestions(originalQuestions)
      }
    }

    if (sessionData?.data?.publicKey) {
      retrieveProgress()
    }
    else {
      setProgress(0)
      setQuestions(originalQuestions)
    }

  }, [sessionData?.data?.publicKey])



  return (
    <main className={`flex scrollbar w-full h-screen flex-col items-center justify-between bg-black text-zinc-200 scrollbar ${inter.className}`}>
      <title>Pyre</title>
      {selectedComponent === "Landing" ? (
        <>

          <div className='flex flex-row justify-between w-full items-center p-4 border-b border-zinc-900'>
            <div className='flex text-zinc-200 text-2xl font-bold xl:px-6 space-x-4 select-none'>
              <Image className='' alt="Helius" src="/helius.svg" width={24} height={24}></Image>
              <span>
                PYRE
              </span>
            </div>


            <div className='flex'>
              <SignMessage />
            </div>

          </div>

          <Landing setSelectedComponent={setSelectedComponent} />
        </>
      ) : (
        (selectedComponent === "QuestionMenu") ? (
          <>
            {
              (questions.length == 0) ?
                <End originalQuestions={originalQuestions} mintedAward={mintedAward} setMintedAward={setMintedAward} setSelectedComponent={setSelectedComponent} progress={progress}></End>
                : (
                  (track) ?
                    <QuestionMenu completed={completed} originalQuestions={originalQuestions} sessionData={sessionData} track={track} setTrack={setTrack} userData={userData} questions={questions} progress={progress} setProgress={setProgress} setQuestion={setQuestion} setSelectedComponent={setSelectedComponent} />
                    :
                    <Tracks originalQuestions={originalQuestions} setTrack={setTrack} progress={progress} setProgress={setProgress} setQuestion={setQuestion} setSelectedComponent={setSelectedComponent}/>
                )
            }
          </>
        ) :
          <Question originalQuestions={originalQuestions} completed={completed} setCompleted={setCompleted} question={question} questions={questions} progress={progress} setQuestions={setQuestions} setProgress={setProgress} setSelectedComponent={setSelectedComponent} />

      )}

    </main>
  )
}
