import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import axios from 'axios';

const QRScanner = () => {
	const [ticket, setTicket] = useState(null);
	const [error, setError] = useState(null);
	const [scanning, setScanning] = useState(true);

	// When QR is scanned
	const handleScan = async (result) => {
		if (result?.text && scanning) {
			setScanning(false); // stop double scans
			const ticketId = result.text.trim();

			try {
				const res = await axios.get(`/api/tickets/check/${ticketId}`, {
					headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
				});
				setTicket(res.data.data);
				setError(null);
			} catch (err) {
				setError(err.response?.data?.message || 'Failed to fetch ticket');
				setTicket(null);
			}
		}
	};

	const handleError = (err) => {
		console.error(err);
		setError('QR scan error');
	};

	// Mark ticket as used
	const markAsUsed = async () => {
		try {
			const res = await axios.patch(
				`/api/tickets/check/${ticket.ticketId}/status`,
				{ isUsed: true },
				{ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
			);
			setTicket(res.data.data);
		} catch (err) {
			setError(err.response?.data?.message || 'Failed to update ticket');
		}
	};

	return (
		<div className="flex flex-col items-center p-4">
			<h1 className="text-2xl font-bold mb-4">Ticket Scanner</h1>

			{scanning ? (
				<QrReader
					onResult={(result, error) => {
						if (!!result) handleScan(result);
						if (!!error) handleError(error);
					}}
					constraints={{ facingMode: 'environment' }} // use back camera
					style={{ width: '100%' }}
				/>
			) : (
				<button
					onClick={() => {
						setTicket(null);
						setError(null);
						setScanning(true);
					}}
					className="bg-blue-600 text-white px-4 py-2 rounded-md mt-4"
				>
					Scan Again
				</button>
			)}

			{error && <p className="text-red-500 mt-4">{error}</p>}

			{ticket && (
				<div
					className={`mt-6 p-4 rounded-lg shadow-lg w-full max-w-md ${
						ticket.isUsed
							? 'bg-red-100 border border-red-400'
							: 'bg-green-100 border border-green-400'
					}`}
				>
					<h2 className="text-xl font-bold mb-2">{ticket.fullName}</h2>
					<p>
						<strong>Email:</strong> {ticket.email}
					</p>
					<p>
						<strong>Phone:</strong> {ticket.phone}
					</p>
					<p>
						<strong>Event:</strong> {ticket.eventName}
					</p>
					<p>
						<strong>Status:</strong>{' '}
						{ticket.isUsed ? (
							<span className="text-red-600 font-bold">Already Used</span>
						) : (
							<span className="text-green-600 font-bold">Not Used</span>
						)}
					</p>

					{!ticket.isUsed && (
						<button
							onClick={markAsUsed}
							className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md"
						>
							Mark as Used
						</button>
					)}
				</div>
			)}
		</div>
	);
};

export default QRScanner;
