import "./App.css";
import { useEffect, useState } from "react";

import console from "console-browserify";

// Moralis
import {
	useMoralis,
	useChain,
	useWeb3ExecuteFunction,
	useApiContract,
	useMoralisWeb3ApiCall,
	runContractFunction,
	useMoralisWeb3Api,
} from "react-moralis";

// Smart Contract ABI
import abi from "./Utils/LaxmiCryptFund.json";

// Ethers for calling smart contract functions
import { ethers } from "ethers";

// Importing sweelalert2
import Swal from "sweetalert2";

// Loader Component
import BeatLoader from "react-spinners/BeatLoader";

// Importing all sounds
import totalInvestorsSound from "./Sounds/totalInvestorsSound.mp3";
import investorsWonSound from "./Sounds/investorsWonSound.mp3";
import investorsLostSound from "./Sounds/investorsLostSound.mp3";
import aboutTheProjectSound from "./Sounds/aboutTheProjectSound.mp3";
import infiniteMarqueeSound from "./Sounds/infiniteMarqueeSound.mp3";
import laxmiCryptFundSound from "./Sounds/laxmiCryptFundSound.mp3";
import schemeSound from "./Sounds/schemeSound.mp3";
import investSound from "./Sounds/investSound.mp3";
import faucetSound from "./Sounds/faucetSound.mp3";
import policySound from "./Sounds/policySound.mp3";
import recentInvestmentsSound from "./Sounds/recentInvestmentsSound.mp3";
import investInputSound from "./Sounds/investInputSound.mp3";
import inquiriesSound from "./Sounds/inquiriesSound.mp3";
import quickLinksSound from "./Sounds/quickLinksSound.mp3";

// Importing Logos
import laxmiCryptFundLogo from "./Logos/laxmi-crypt-fund-logo-foam.svg";
import twitterLogo from "./Logos/twitter-logo-foam.svg";
import polygonLogo from "./Logos/polygon-logo-foam.svg";
import githubLogo from "./Logos/github-logo-foam.svg";

function App() {
	// Contract Address
	const CONTRACT_ADDRESS = "0x085d174c046DfdeAE987D27fF5446D31A570D6AA";

	// Contract ABI
	const CONTRACT_ABI = abi.abi;

	// Setting Page Loading State
	const [loading, setLoading] = useState(true);

	// Enter the site
	const [canEnter, setCanEnter] = useState(false);

	// Tracking investors
	const [investors, setInvestors] = useState(0);

	// Tracking memos
	const [memos, setMemos] = useState([]);

	// Tracking won and lost investors
	const [won, setWon] = useState(0);
	const [lost, setLost] = useState(0);

	// Tracking max and min investment
	const [maxInvestment, setMaxInvestment] = useState(0);
	const [minInvestment, setMinInvestment] = useState(0);

	// Tracking investment
	const [investment, setInvestment] = useState("");

	// Using Moralis Native API
	const { native } = useMoralisWeb3Api();

	// Const options required to call a function on Moralis API
	const options = {
		chain: "mumbai",
		address: CONTRACT_ADDRESS,
		function_name: "getAll",
		abi: CONTRACT_ABI,
	};

	// Fetching all initial parameters
	const { fetch, data, error } = useMoralisWeb3ApiCall(
		native.runContractFunction,
		{
			...options,
		}
	);

	// Function to fetch contract data
	const fetchContractData = async () => {
		try {
			const data = await fetch();

			setInvestors(data[0]);
			setMinInvestment(data[1]);
			setMaxInvestment(data[2]);
			setWon(data[3]);
			setLost(data[4]);

			setMemos([]);

			for (let i = data[5].length - 1; i >= data[5].length - 5; i--) {
				setMemos((prevState) => [
					...prevState,
					{
						investor: data[5][i][0],
						luckyNumber: data[5][i][1],
						result: data[5][i][2],
						investment: data[5][i][3],
						timestamp: new Date(data[5][i][4] * 1000),
					},
				]);
			}

			console.log(`First timestamp is ${memos[0].timestamp}`);
			console.log(`Second timestamp is ${memos[1].timestamp}`);
			console.log(`Third timestamp is ${memos[2].timestamp}`);
		} catch (error) {
			console.log(error);
		}
	};

	// Setting all initial parameters
	useEffect(() => {
		const fetchData = async () => {
			try {
				const data = await fetch();

				setInvestors(data[0]);
				setMinInvestment(data[1]);
				setMaxInvestment(data[2]);
				setWon(data[3]);
				setLost(data[4]);

				setMemos([]);

				for (let i = data[5].length - 1; i >= data[5].length - 5; i--) {
					setMemos((prevState) => [
						...prevState,
						{
							investor: data[5][i][0],
							luckyNumber: data[5][i][1],
							result: data[5][i][2],
							investment: data[5][i][3],
							timestamp: new Date(data[5][i][4] * 1000),
						},
					]);
				}

				setLoading(false);
			} catch (error) {
				console.log(error);
			}
		};

		fetchData();
	}, []);

	// Moralis initialization
	const {
		isInitialized,
		enableWeb3,
		isWeb3Enabled,
		web3,
		Moralis,
		authenticate,
		isAuthenticated,
		isAuthenticating,
		user,
		account,
		logout,
		refetchUserData,
	} = useMoralis();

	// Switch network functionality from Moralis
	const { switchNetwork, chain, chainId } = useChain();

	// Preventing page refresh on submit
	const handleSubmit = (event) => {
		event.preventDefault();
	};

	// Handling investment value
	const handleInvestmentChange = (event) => {
		setInvestment(event.target.value);
	};

	// Handling investment value
	const EnterSite = () => {
		setCanEnter(true);
	};

	// Function to Invest
	const invest = async () => {
		if (account) {
			if (chainId === "0x13881") {
				if (investment > ethers.utils.formatEther(maxInvestment)) {
					Swal.fire({
						position: "center",
						icon: "error",
						title: `<strong>Very High Investment!</strong> 👀 <br/> We do not take investment greater than ${ethers.utils.formatEther(
							maxInvestment
						)} MATIC ✅  <br/><strong>Try decreasing the investment! 💯</strong> `,
						showConfirmButton: true,
					});
				} else if (
					investment < ethers.utils.formatEther(minInvestment)
				) {
					Swal.fire({
						position: "center",
						icon: "error",
						title: `<strong>Very Low Investment!</strong> 👀 <br/> We do not take investment less than ${ethers.utils.formatEther(
							minInvestment
						)} MATIC ✅  <br/><strong>Try increasing the investment! 💯</strong> `,
						showConfirmButton: true,
					});
				} else {
					try {
						const { ethereum } = window;

						if (ethereum) {
							const provider = new ethers.providers.Web3Provider(
								ethereum,
								"any"
							);
							const signer = provider.getSigner();
							const LaxmiCryptFundContract = new ethers.Contract(
								CONTRACT_ADDRESS,
								CONTRACT_ABI,
								signer
							);
							Swal.fire({
								position: "center",
								icon: "info",
								title: "Confirm the MetaMask Transaction for Investment! 👀",
								showConfirmButton: false,
								timer: 4000,
							});

							console.log("Investing...");
							const investTxn =
								await LaxmiCryptFundContract.invest({
									gasLimit: 180000,
									value: ethers.utils.parseEther(investment),
								});

							Swal.fire({
								position: "center",
								icon: "info",
								title: "Investing MATIC!\n This might take a few minutes.\n Please wait... ⏳",
								showConfirmButton: true,
							});

							await investTxn.wait();

							let gettingWon =
								await LaxmiCryptFundContract.getWon();

							if (gettingWon.toNumber() > won) {
								Swal.fire({
									position: "center",
									icon: "success",
									title: `<strong>Congrats!</strong> 🎉 <br/> Your MATIC has been doubled and sent to your address ✅ <br/><strong>Keep Investing! 💯</strong> `,
									showConfirmButton: true,
								});
							} else {
								Swal.fire({
									position: "center",
									icon: "error",
									title: `<strong>Whooops!</strong> 👀 <br/> Anuradha ran away with your MATIC 😭 <br/><strong>Better luck next time! 💯</strong> `,
									showConfirmButton: true,
								});
							}

							setInvestment("");

							fetchContractData();

							console.log("Transaction Hash: ", investTxn.hash);

							console.log("Invested successfully!");
						}
					} catch (error) {
						Swal.fire({
							position: "center",
							icon: "error",
							title: `<strong>Insufficient Gas!</strong> 👀 <br/> Increase the gas amount for successful transaction 💯<br/>`,
							showConfirmButton: true,
						});

						console.log(error);
					}
				}
			} else {
				Swal.fire({
					position: "center",
					icon: "warning",
					title: `<strong>Wrong Network!</strong> 👀 <br/> <br/> Please switch to Polygon Mumbai Testnet 🙄  <br/>`,
					showConfirmButton: true,
				});
			}
		} else {
			Swal.fire({
				position: "center",
				icon: "warning",
				title: `<strong>Wallet Not Connected!</strong> 👀 <br/> <br/> Please connect your wallet to invest in Laxmi Crypt Fund 🙄  <br/>`,
				showConfirmButton: true,
			});
		}
	};

	// Checking for already existing connection
	useEffect(() => {
		const connectorId = window.localStorage.getItem("connectorId");

		if (isAuthenticated && !isWeb3Enabled) {
			enableWeb3({ provider: connectorId });
		}
	}, [isAuthenticated, isWeb3Enabled]);

	// Loading all sounds
	const TotalInvestorsSound = new Audio(totalInvestorsSound);
	const InvestorsWonSound = new Audio(investorsWonSound);
	const InvestorsLostSound = new Audio(investorsLostSound);
	const AboutTheProjectSound = new Audio(aboutTheProjectSound);
	const InfiniteMarqueeSound = new Audio(infiniteMarqueeSound);
	const LaxmiCryptFundSound = new Audio(laxmiCryptFundSound);
	const SchemeSound = new Audio(schemeSound);
	const InvestSound = new Audio(investSound);
	const FaucetSound = new Audio(faucetSound);
	const PolicySound = new Audio(policySound);
	const RecentInvestmentsSound = new Audio(recentInvestmentsSound);
	const InvestInputSound = new Audio(investInputSound);
	const QuickLinksSound = new Audio(quickLinksSound);
	const InquiriesSound = new Audio(inquiriesSound);

	return (
		<>
			{canEnter === false ? (
				<>
					<div className="loading-screen">
						{loading ? (
							<>
								<div className="loading-title">LOADING</div>
								<BeatLoader
									color={"#e8f9fd"}
									loading={loading}
									size={60}
								/>
							</>
						) : (
							<>
								<div
									onClick={EnterSite}
									className="enter-site"
									id="enter-site"
								>
									<div className="enter-site-title">
										Enter
									</div>
								</div>
							</>
						)}
					</div>
				</>
			) : (
				<>
					<div className="App">
						<div className="nav-bar">
							<div className="left-logos">
								<a
									href="https://mumbai.polygonscan.com/address/0x085d174c046DfdeAE987D27fF5446D31A570D6AA"
									target="_blank"
									rel="noreferrer"
								>
									<img
										className="logo"
										src={laxmiCryptFundLogo}
									></img>
								</a>
							</div>

							<div className="right-logos">
								<a
									href="https://mumbai.polygonscan.com/address/0x085d174c046DfdeAE987D27fF5446D31A570D6AA#code"
									target="_blank"
									rel="noreferrer"
								>
									<img
										className="logo"
										src={polygonLogo}
									></img>
								</a>

								<a
									href="https://github.com/githubotoro/laxmi-crypt-fund-web3-app"
									target="_blank"
									rel="noreferrer"
								>
									<img
										className="logo"
										src={githubLogo}
									></img>
								</a>

								<a
									href="https://twitter.com/yupuday"
									target="_blank"
									rel="noreferrer"
								>
									<img
										className="logo"
										src={twitterLogo}
									></img>
								</a>
							</div>
						</div>

						<div
							className="heading"
							onMouseEnter={() => {
								LaxmiCryptFundSound.play();
							}}
							onMouseLeave={() => {
								LaxmiCryptFundSound.pause();
								LaxmiCryptFundSound.currentTime = 0;
							}}
						>
							<div className="title">LAXMI CRYPT FUND</div>
							<div className="subtitle">
								21 sec Mein Crypto Double
							</div>
						</div>

						<div
							className="infinite-marquee"
							onMouseEnter={() => {
								InfiniteMarqueeSound.play();
							}}
							onMouseLeave={() => {
								InfiniteMarqueeSound.pause();
								InfiniteMarqueeSound.currentTime = 0;
							}}
						>
							<div className="track">
								Ek Ka Double{" "}
								<span className="only-border-text">
									Ek Ka Double
								</span>{" "}
								Ek Ka Double{" "}
								<span className="only-border-text">
									Ek Ka Double
								</span>{" "}
								Ek Ka Double{" "}
								<span className="only-border-text">
									Ek Ka Double
								</span>{" "}
								Ek Ka Double{" "}
								<span className="only-border-text">
									Ek Ka Double
								</span>{" "}
								Ek Ka Double{" "}
								<span className="only-border-text">
									Ek Ka Double
								</span>{" "}
								Ek Ka Double{" "}
								<span className="only-border-text">
									Ek Ka Double
								</span>{" "}
								Ek Ka Double{" "}
								<span className="only-border-text">
									Ek Ka Double
								</span>{" "}
								Ek Ka Double{" "}
								<span className="only-border-text">
									Ek Ka Double
								</span>{" "}
								Ek Ka Double{" "}
								<span className="only-border-text">
									Ek Ka Double
								</span>{" "}
								Ek Ka Double{" "}
								<span className="only-border-text">
									Ek Ka Double
								</span>{" "}
								Ek Ka Double{" "}
								<span className="only-border-text">
									Ek Ka Double
								</span>{" "}
								Ek Ka Double{" "}
								<span className="only-border-text">
									Ek Ka Double
								</span>{" "}
								Ek Ka Double{" "}
								<span className="only-border-text">
									Ek Ka Double
								</span>{" "}
								Ek Ka Double{" "}
								<span className="only-border-text">
									Ek Ka Double
								</span>
							</div>
						</div>

						{!isAuthenticated || !isWeb3Enabled ? (
							<>
								<div
									onClick={() =>
										authenticate({
											signingMessage:
												"Laxmi Crypt Fund Authentication",
										})
									}
									className="connect-wallet"
									id="connect-wallet"
								>
									Connect Wallet
								</div>
							</>
						) : (
							<>
								{chainId === "0x13881" ? (
									<>
										<div className="connected-container">
											<div
												className="connected"
												id="connected"
											>
												<center>
													Connected :{" "}
													{account.slice(0, 7)}...
												</center>
											</div>

											<div
												onClick={() => logout()}
												className="connect-wallet"
												id="connect-wallet"
											>
												Disconnect Wallet
											</div>
										</div>
									</>
								) : (
									<>
										<div className="switch-container">
											<div
												onClick={() =>
													switchNetwork("0x13881")
												}
												className="connected"
												id="connected"
											>
												Click Here To Switch to Polygon
												Mumbai Testnet!
											</div>
										</div>
									</>
								)}
							</>
						)}

						<form onSubmit={handleSubmit}>
							<input
								value={investment}
								name="investment"
								className="input-class"
								id="input-id"
								type="text"
								placeholder=">= 0.0001 AND <= 0.01"
								onChange={handleInvestmentChange}
								onMouseEnter={() => {
									InvestInputSound.play();
								}}
								onMouseLeave={() => {
									InvestInputSound.pause();
									InvestInputSound.currentTime = 0;
								}}
							/>
							<button
								onClick={invest}
								className="button-class"
								id="button-id"
								type="submit"
								onMouseEnter={() => {
									InvestSound.play();
								}}
								onMouseLeave={() => {
									InvestSound.pause();
									InvestSound.currentTime = 0;
								}}
							>
								Invest
							</button>
						</form>

						<div
							className="total-investors"
							id="total-investors"
							onMouseEnter={() => {
								TotalInvestorsSound.play();
							}}
							onMouseLeave={() => {
								TotalInvestorsSound.pause();
								TotalInvestorsSound.currentTime = 0;
							}}
						>
							<span className="total-investors-title">
								Total Investors: {investors}
							</span>
						</div>

						<div className="stats-container">
							<div
								className="stats"
								id="stats"
								onMouseEnter={() => {
									InvestorsWonSound.play();
								}}
								onMouseLeave={() => {
									InvestorsWonSound.pause();
									InvestorsWonSound.currentTime = 0;
								}}
							>
								<span className="stats-title">
									Investors Won: {won}
								</span>
							</div>

							<div
								className="stats"
								id="stats"
								onMouseEnter={() => {
									InvestorsLostSound.play();
								}}
								onMouseLeave={() => {
									InvestorsLostSound.pause();
									InvestorsLostSound.currentTime = 0;
								}}
							>
								<span className="stats-title">
									Investors Lost: {lost}
								</span>
							</div>
						</div>

						<div
							className="info"
							id="info"
							onMouseEnter={() => {
								AboutTheProjectSound.play();
							}}
							onMouseLeave={() => {
								AboutTheProjectSound.pause();
								AboutTheProjectSound.currentTime = 0;
							}}
						>
							<span className="info-title">
								About The Project
							</span>
							<hr />
							This project is inspired from Neeraj Vora's
							directoral "Phir Hera Pheri" (2006). It's a Web3
							parody of "Laxmi Chit Fund" on Polygon Mumbai
							Testnet. Whenever an investment is made, there is
							50% chance of getting it doubled, and 50% chance of
							losing it all.
							<hr />
							<span className="info-quote">
								<i>
									"Crypt Fund investments are subject to
									market risks,
									<br />
									read all scheme related documents
									carefully."
								</i>
							</span>
						</div>

						<a
							className="faucet-width"
							href="https://mumbaifaucet.com/"
							target="_blank"
							rel="noreferrer"
							onMouseEnter={() => {
								FaucetSound.play();
							}}
							onMouseLeave={() => {
								FaucetSound.pause();
								FaucetSound.currentTime = 0;
							}}
						>
							<div className="faucet" id="faucet">
								<span className="faucet-title">
									Don't have MATIC to INVEST?
								</span>
								<hr />
								You can get it for free from "POLYGON FAUCET".
								<br />
								<span className="go-to-faucet">
									Click here to go to Faucet!
								</span>
							</div>
						</a>

						<div
							className="policy"
							id="policy"
							onMouseEnter={() => {
								PolicySound.play();
							}}
							onMouseLeave={() => {
								PolicySound.pause();
								PolicySound.currentTime = 0;
							}}
						>
							<span className="policy-title">Policy</span>
							<hr />
							Invest MATIC and receive 2x the amount in just 21
							seconds.
							<hr />
							<span className="policy-quote">
								<i>
									“Hum naa hi 0.01 MATIC see zyada crypto lete
									hain,
									<br />
									aurr naa hi 0.001 MATIC see kam.”
								</i>
							</span>
						</div>

						<div
							className="memos"
							id="memos"
							onMouseEnter={() => {
								RecentInvestmentsSound.play();
							}}
							onMouseLeave={() => {
								RecentInvestmentsSound.pause();
								RecentInvestmentsSound.currentTime = 0;
							}}
						>
							<span className="memos-title">
								Recent Investments
							</span>

							{memos.map((memo, idx) => {
								return (
									<div key={idx}>
										<hr />
										At{" "}
										<span className="memos-bold">
											{memo.timestamp.toString()}:
										</span>{" "}
										<br />
										Investor ({memo.investor})
										<br />
										<span className="memos-bold">
											{memo.result}
										</span>{" "}
										their investment of{" "}
										<span className="memos-bold">
											{Moralis.Units.FromWei(
												memo.investment,
												18
											)}{" "}
											MATIC
										</span>{" "}
									</div>
								);
							})}
						</div>

						<div
							className="scheme"
							id="scheme"
							onMouseEnter={() => {
								SchemeSound.play();
							}}
							onMouseLeave={() => {
								SchemeSound.pause();
								SchemeSound.currentTime = 0;
							}}
						>
							<span className="scheme-title">Scheme</span>
							<hr />
							Yeh apna Raju, Shyam, Babu Bhaiya, sab ameer kaise
							bana?
							<br />
							Uska <s>cigratte</s> secret mil gaya hain.
							<br />
							Woh log kya karte hain na, sara Crypto, Crypt Fund
							mein dalte hain.
							<br />
							21 sec mein Crypto Double
							<br />
							Uske aur 21 sec mein Crypto 4 Guna
							<br />
							Uske aur 21 sec mein Crypto 8 Guna
							<br />
							Uske aur 21 sec mein Crypto 16 Guna
							<br />
							Uske aur 21 sec mein Crypto 32 Guna...
							<hr />
							<span className="scheme-quote">
								<i>"Zor-Zor se bolke Scheme bata dooo..."</i>
							</span>
						</div>

						<div
							className="inquiries"
							id="inquiries"
							onMouseEnter={() => {
								InquiriesSound.play();
							}}
							onMouseLeave={() => {
								InquiriesSound.pause();
								InquiriesSound.currentTime = 0;
							}}
						>
							<span className="inquiries-title">
								For Inquiries
							</span>
							<hr />
							Address: Shaitaan Gali, Khatra Mahal, Andher Nagar,
							Samshaan ke samne.
							<hr />
							<span className="inquiries-quote">
								<i>
									"Yeh Lottery Wottery na, sab gareeb logo ka
									kaam hain,
									<br />
									Main too business karta hoon."
								</i>
							</span>
						</div>

						<div
							className="quick-links"
							id="quick-links"
							onMouseEnter={() => {
								QuickLinksSound.play();
							}}
							onMouseLeave={() => {
								QuickLinksSound.pause();
								QuickLinksSound.currentTime = 0;
							}}
						>
							<span className="quick-links-title">
								QUICK LINKS
							</span>
							<hr />
							<a
								className="quick-links-link"
								href="https://github.com/githubotoro/laxmi-crypt-fund-smart-contract"
								rel="noreferrer"
								target="_blank"
							>
								GitHub Smart Contract
							</a>{" "}
							&nbsp;
							<span className="dot"></span>
							&nbsp;{" "}
							<a
								className="quick-links-link"
								href="https://www.producthunt.com/@yupuday/made"
								rel="noreferrer"
								target="_blank"
							>
								Product Hunt
							</a>{" "}
							&nbsp;
							<span className="dot"></span>
							&nbsp;{" "}
							<a
								className="quick-links-link"
								href="https://github.com/githubotoro/laxmi-crypt-fund-web3-app"
								rel="noreferrer"
								target="_blank"
							>
								GitHub Web3 App
							</a>
							<br />
							<a
								className="quick-links-link"
								href="https://twitter.com/yupuday"
								rel="noreferrer"
								target="_blank"
							>
								Twitter
							</a>{" "}
							&nbsp;
							<span className="dot"></span>
							&nbsp;{" "}
							<a
								className="quick-links-link"
								href="https://mumbai.polygonscan.com/address/0x085d174c046DfdeAE987D27fF5446D31A570D6AA"
								rel="noreferrer"
								target="_blank"
							>
								PolygonScan
							</a>{" "}
							&nbsp;
							<span className="dot"></span>
							&nbsp;{" "}
							<a
								className="quick-links-link"
								href="https://opensea.io/collection/totorulla"
								rel="noreferrer"
								target="_blank"
							>
								OpenSea
							</a>{" "}
							&nbsp;
							<span className="dot"></span>
							&nbsp;{" "}
							<a
								className="quick-links-link"
								href="https://twitter.com/totorulla"
								rel="noreferrer"
								target="_blank"
							>
								Totorulla
							</a>
							<hr />
							<div className="quick-links-quote">
								<i>
									“Ek zamana tha, jab hum bhi gareeb hua karte
									the..."
								</i>
							</div>
						</div>
					</div>
				</>
			)}
		</>
	);
}

export default App;
