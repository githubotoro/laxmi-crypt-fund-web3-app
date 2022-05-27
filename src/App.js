import logo from "./logo.svg";
import "./App.css";
import {
	useMoralis,
	useChain,
	useWeb3ExecuteFunction,
	useApiContract,
	useMoralisWeb3ApiCall,
	runContractFunction,
} from "react-moralis";

import { ConnectButton } from "web3uikit";
import { useEffect, useState } from "react";
import abi from "./Utils/CryptoChai.json";

import { useMoralisWeb3Api } from "react-moralis";

function App() {
	const [chais, setChais] = useState(0);

	const { native } = useMoralisWeb3Api();

	const CONTRACT_ADDRESS = "0x70856254B2bEc0c6B0a591554bbbbea7b40389EB";
	const CONTRACT_ABI = abi.abi;

	const options = {
		chain: "mumbai",
		address: CONTRACT_ADDRESS,
		function_name: "chais",
		abi: CONTRACT_ABI,
	};

	const { fetch, data, error, isLoading } = useMoralisWeb3ApiCall(
		native.runContractFunction,
		{ ...options }
	);

	// const { chais, data, error } = useApiContract({
	// 	address: CONTRACT_ADDRESS,
	// 	functionName: "chais()",
	// 	abi: CONTRACT_ABI,
	// 	chain: "mumbai",
	// });

	const {
		web3,
		Moralis,
		authenticate,
		isAuthenticated,
		isAuthenticating,
		user,
		account,
		logout,
		chainId,
	} = useMoralis();

	const { switchNetwork, chain } = useChain();

	useEffect(() => {
		const fetchData = async () => {
			const data = await fetch(options);
			console.log(data);
			setChais(data);
		};

		fetchData();
	}, []);

	return (
		<>
			{chais}

			{/* TESTING */}

			<div className="App">
				<div className="heading">
					<div className="title">LAXMI CRYPT FUND</div>
					<div className="subtitle">21 sec Mein Crypto Double</div>
				</div>

				<div className="infinite-marquee">
					<div className="track">
						Ek Ka Double{" "}
						<span className="only-border-text">Ek Ka Double</span>{" "}
						Ek Ka Double{" "}
						<span className="only-border-text">Ek Ka Double</span>{" "}
						Ek Ka Double{" "}
						<span className="only-border-text">Ek Ka Double</span>{" "}
						Ek Ka Double{" "}
						<span className="only-border-text">Ek Ka Double</span>{" "}
						Ek Ka Double{" "}
						<span className="only-border-text">Ek Ka Double</span>{" "}
						Ek Ka Double{" "}
						<span className="only-border-text">Ek Ka Double</span>{" "}
						Ek Ka Double{" "}
						<span className="only-border-text">Ek Ka Double</span>{" "}
						Ek Ka Double{" "}
						<span className="only-border-text">Ek Ka Double</span>{" "}
						Ek Ka Double{" "}
						<span className="only-border-text">Ek Ka Double</span>{" "}
						Ek Ka Double{" "}
						<span className="only-border-text">Ek Ka Double</span>{" "}
						Ek Ka Double{" "}
						<span className="only-border-text">Ek Ka Double</span>{" "}
						Ek Ka Double{" "}
						<span className="only-border-text">Ek Ka Double</span>{" "}
						Ek Ka Double{" "}
						<span className="only-border-text">Ek Ka Double</span>{" "}
						Ek Ka Double{" "}
						<span className="only-border-text">Ek Ka Double</span>
					</div>
				</div>

				{!isAuthenticated ? (
					<>
						<div
							onClick={() => authenticate()}
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
								<div
									onClick={() => logout()}
									className="connect-wallet"
									id="connect-wallet"
								>
									Disconnect Wallet
								</div>
							</>
						) : (
							<>
								<div className="switch-title">
									Please Switch to Polygon Mumbai Testnet
								</div>

								<div
									onClick={() => switchNetwork("0x13881")}
									className="connect-wallet"
									id="connect-wallet"
								>
									Click Here To Switch!
								</div>
							</>
						)}
					</>
				)}

				<div className="info" id="info">
					<span className="info-title">About The Project</span>
					<br />
					This project is inspired from Neeraj Vora's directoral "Phir
					Hera Pheri" (2006).
					<br />
					It's a Web3 parody of "Laxmi Crypt Fund" on Polygon Mumbai
					Testnet. Whenever an investment is made, there is 50% chance
					of getting it doubled, and 50% chance of losing it all.
					<hr />
					<span className="info-quote">
						<i>
							"Crypt Fund investments are subject to market risks,
							<br />
							read all scheme related documents carefully.""
						</i>
					</span>
				</div>

				<div className="policy" id="policy">
					<span className="policy-title">Policy</span>
					<br />
					Invest MATIC and receive 2x the amount in just 21 seconds.
					<hr />
					<span className="policy-quote">
						<i>
							“Naa hi hum 0.01 MATIC see zyada lete hain,
							<br />
							Naa hi 0.001 MATIC see kam.”
						</i>
					</span>
				</div>

				<div className="stats">
					<div className="scammed">Investors Scammed: 50</div>
					<div className="millionares">Crorepatis Made: 100</div>
				</div>

				{/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
			</div>
		</>
	);
}

export default App;
