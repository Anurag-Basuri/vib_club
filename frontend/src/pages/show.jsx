import { useState } from 'react';
import ShowContacts from '../components/Showcontacts.jsx';
import ShowApplies from '../components/Showapplies.jsx';

const ShowPage = () => {
	const [view, setView] = useState('applications');

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 md:p-8">
			<div className="max-w-6xl mx-auto">
				<div className="flex flex-col md:flex-row justify-between items-center mb-8">
					<div className="mt-4 md:mt-0 flex gap-3">
						<button
							onClick={() => setView('applications')}
							className={`px-5 py-2 rounded-lg font-semibold transition shadow ${
								view === 'applications'
									? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-cyan-500/30'
									: 'bg-gray-800/60 text-cyan-200 hover:bg-gray-700'
							}`}
						>
							Applications
						</button>
						<button
							onClick={() => setView('contacts')}
							className={`px-5 py-2 rounded-lg font-semibold transition shadow ${
								view === 'contacts'
									? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-cyan-500/30'
									: 'bg-gray-800/60 text-cyan-200 hover:bg-gray-700'
							}`}
						>
							Contacts
						</button>
					</div>
				</div>
				<div>{view === 'applications' ? <ShowApplies /> : <ShowContacts />}</div>
			</div>
		</div>
	);
};

export default ShowPage;
