// *** YOU ARE LIMITED TO THE FOLLOWING IMPORTS TO BUILD YOUR PHAT CONTRACT     ***
// *** ADDING ANY IMPORTS WILL RESULT IN ERRORS & UPLOADING YOUR CODE TO PHALA  ***
// *** NETWORK WILL FAIL. IF YOU WANT TO KNOW MORE, JOIN OUR DISCORD TO SPEAK   ***
// *** WITH THE PHALA TEAM AT https://discord.gg/5HfmWQNX THANK YOU             ***
import "@phala/pink-env";
import { Coders } from "@phala/ethers";

type HexString = `0x${string}`

const uintCoder = new Coders.NumberCoder(32, false, "uint256");
const bytesCoder = new Coders.BytesCoder("bytes");

function encodeReply(reply: [number, number, number]): HexString {
  return Coders.encode([uintCoder, uintCoder, uintCoder], reply) as HexString;
}

// Defined in OracleConsumerContract.sol
const TYPE_RESPONSE = 0;
const TYPE_ERROR = 2;

// ToDo fill it out with your Github API key
const GITHUB_API_KEY = ""

enum Error {
  BadRequestString = "BadRequestString",
  FailedToFetchData = "FailedToFetchData",
  FailedToDecode = "FailedToDecode",
  MalformedRequest = "MalformedRequest",
}

function errorToCode(error: Error): number {
  switch (error) {
    case Error.BadRequestString:
      return 1;
    case Error.FailedToFetchData:
      return 2;
    case Error.FailedToDecode:
      return 3;
    case Error.MalformedRequest:
      return 4;
    default:
      return 0;
  }
}

function isHexString(str: string): boolean {
  const regex = /^0x[0-9a-f]+$/;
  return regex.test(str.toLowerCase());
}

function stringToHex(str: string): string {
  var hex = "";
  for (var i = 0; i < str.length; i++) {
    hex += str.charCodeAt(i).toString(16);
  }
  return "0x" + hex;
}

function fetchApiStats(apiUrl: string, reqStr: string): any {
  // reqStr should be any valid hex string
  let headers = {
    "Content-Type": "application/json",
    "User-Agent": "phat-contract",
    "Authorization": `Bearer ${GITHUB_API_KEY}`
  };
  let response = pink.batchHttpRequest(
    [
      {
        url: apiUrl,
        method: "GET",
        headers,
        // body,
        returnTextBody: true,
      },
    ],
    10000
  )[0];
  if (response.statusCode !== 200) {
    console.log(
      `Fail to read Lens api with status code: ${response.statusCode}, error: ${
        response.error || response.body
      }}`
    );
    throw Error.FailedToFetchData;
  } else {
    console.log("works")
  }
  let respBody = response.body;
  if (typeof respBody !== "string") {
    throw Error.FailedToDecode;
  }
  console.log(JSON.parse(respBody))
  return JSON.parse(respBody);
}

function parseReqStr(hexStr: string): string {
  var hex = hexStr.toString();
  if (!isHexString(hex)) {
    throw Error.BadRequestString;
  }
  hex = hex.slice(2);
  var str = "";
  for (var i = 0; i < hex.length; i += 2) {
    const ch = String.fromCharCode(parseInt(hex.substring(i, i + 2), 16));
    str += ch;
  }
  return str;
}


//
// Here is what you need to implemented for Phat Contract, you can customize your logic with
// JavaScript here.
//
// The Phat Contract will be called with two parameters:
//
// - request: The raw payload from the contract call `request` (check the `request` function in TestLensApiConsumerConract.sol).
//            In this example, it's a tuple of two elements: [requestId, profileId]
// - secrets: The custom secrets you set with the `config_core` function of the Action Offchain Rollup Phat Contract. In
//            this example, it just a simple text of the lens api url prefix. For more information on secrets, checkout the SECRETS.md file.
//
// Your returns value MUST be a hex string, and it will send to your contract directly. Check the `_onMessageReceived` function in
// OracleConsumerContract.sol for more details. We suggest a tuple of three elements: [successOrNotFlag, requestId, data] as
// the return value.
//
export default function main(request: HexString, secrets: string): HexString {
  console.log(`handle req: ${request}`);
  // Uncomment to debug the `settings` passed in from the Phat Contract UI configuration.
  // console.log(`secrets: ${settings}`);
  let requestId, encodedReqStr;
  try {
    [requestId, encodedReqStr] = Coders.decode([uintCoder, bytesCoder], request);
  } catch (error) {
    console.info("Malformed request received");
    return encodeReply([TYPE_ERROR, 0, errorToCode(error as Error)]);
  }
  const parsedHexReqStr = parseReqStr(encodedReqStr as string);
  console.log(`Request received for profile ${parsedHexReqStr}`);

  try {
    const respData = fetchApiStats(secrets, parsedHexReqStr);
    console.log(respData)
    let stats = JSON.stringify(respData);
    console.log("response:", [TYPE_RESPONSE, requestId, stats]);
    return stringsToHexString(stats);
    // return encodeReply([TYPE_RESPONSE, requestId, stats]);
    // let stats = respData.data.profile.stats.totalPosts;
    // console.log("response:", [TYPE_RESPONSE, requestId, stats]);
    // return encodeReply([TYPE_RESPONSE, requestId, stats]);
  } catch (error) {
    if (error === Error.FailedToFetchData) {
      throw error;
    } else {
      // otherwise tell client we cannot process it
      console.log("error:", [TYPE_ERROR, requestId, error]);
      return encodeReply([TYPE_ERROR, requestId, errorToCode(error as Error)]);
    }
  }
}


function stringsToHexString(strings: any): HexString {
  let hexString = '0x';
  for (let i = 0; i < strings.length; i++) {
    const string = strings[i];
    for (let j = 0; j < string.length; j++) {
      const charCode = string.charCodeAt(j);
      const hex = charCode.toString(16);
      hexString += hex;
    }
  }
  return hexString as HexString;
}
