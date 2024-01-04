import { useEffect, useState } from 'react';
import './index.css';
import { firestore } from './firestore';
import { onSnapshot, collection, DocumentData, QuerySnapshot, query, Timestamp, orderBy, QueryDocumentSnapshot, startAfter, limit } from 'firebase/firestore';

// The database model to article
type Article = {
	header: string;
	color: string;
	createdAt: Timestamp;
	views: number;
};

function App() {
	const [popular, setPopular] = useState<(Article & { id: string })[]>([]);
	const [all, setAll] = useState<(Article & { id: string })[]>([]);
	const [filtered1, setFiltered1] = useState<(Article & { id: string })[]>([]);
	const [filtered2, setFiltered2] = useState<(Article & { id: string })[]>([]);

	// Retrieve the data and id from the queries
	const formatArticle = (articles: QuerySnapshot<DocumentData, DocumentData>): (Article & { id: string })[] => {
		return articles.docs.map((e) => {
			const data = e.data() as Article;
			return {
				...data,
				id: e.id,
			};
		});
	};

	useEffect(() => {
		// Save the end of the 1st page to paginate
		let page1EndDocument: QueryDocumentSnapshot<DocumentData, DocumentData>;

		// Get popular articles
		onSnapshot(query(collection(firestore, 'articles'), orderBy('views', 'desc'), limit(10)), (articles) => {
			console.log('popular videos', articles);
			setPopular(formatArticle(articles));
		});

		// Get all recent articles
		onSnapshot(query(collection(firestore, 'articles'), orderBy('createdAt', 'desc'), limit(10)), (articles) => {
			page1EndDocument = articles.docs[articles.docs.length - 1];
			console.log('latest videos', articles);
			setAll(formatArticle(articles));
		});

		// Get page 1 of filtered articles
		onSnapshot(query(collection(firestore, 'articles'), orderBy('createdAt', 'desc'), limit(5)), (articles) => {
			page1EndDocument = articles.docs[articles.docs.length - 1];
			console.log('filtered videos page 1', articles);
			setFiltered1(formatArticle(articles));
		});

		// Wait 2.5s for previous queries to resolve and cache
		setTimeout(() => {
			// Get page 2 of filtered articles
			onSnapshot(query(collection(firestore, 'articles'), orderBy('createdAt', 'desc'), startAfter(page1EndDocument), limit(5)), (articles) => {
				if (articles.metadata.fromCache === false && articles.metadata.hasPendingWrites === false) {
					console.log('filtered videos page 2', articles);
					setFiltered2(formatArticle(articles));
				} else {
					console.log('filtered videos page 2', 'cached page');
				}
			});
		}, 2500);
	}, []);

	return (
		<div className='pb-48'>
			<h1 className='bg-black text-white text-2xl'>Popular videos!</h1>
			{popular.map((e) => (
				<p key={e.id} style={{ backgroundColor: e.color }}>
					{e.header}
				</p>
			))}
			<h1 className='bg-black text-white text-2xl'>Latest videos!</h1>
			{all.map((e) => (
				<p key={e.id} style={{ backgroundColor: e.color }}>
					{e.header}
				</p>
			))}
			<h1 className='bg-black text-white text-2xl'>Filtered videos! (page 1)</h1>
			{filtered1.map((e) => (
				<p key={e.id} style={{ backgroundColor: e.color }}>
					{e.header}
				</p>
			))}
			<h1 className='bg-black text-white text-2xl'>Filtered videos! (page 2)</h1>
			{filtered2.map((e) => (
				<p key={e.id} style={{ backgroundColor: e.color }}>
					{e.header}
				</p>
			))}
		</div>
	);
}

export default App;
