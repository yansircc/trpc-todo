"use client";

import { useState } from "react";

import { api } from "@/trpc/react";

export function TestCard() {
	const [name, setName] = useState("John");
	const [queryName, setQueryName] = useState("");
	const [shouldFetch, setShouldFetch] = useState(false);

	// 使用 queryName 而不是 name 作为查询参数，避免输入触发查询
	const query = api.test.foo.useQuery(
		{ name: queryName },
		{
			enabled: shouldFetch,
		},
	);

	const handleClick = () => {
		// 如果输入值和上次查询值相同且查询已启用，直接refetch
		if (name === queryName && shouldFetch) {
			query.refetch();
		} else {
			// 输入值变化，更新查询参数并启用查询
			setQueryName(name);
			setShouldFetch(true);
		}

		console.log(query.data);
	};

	return (
		<div className="rounded-lg bg-blue-500 p-4 text-white shadow-md">
			<input
				type="text"
				value={name}
				onChange={(e) => setName(e.target.value)}
				className="mr-2 rounded px-2 py-1 text-black"
			/>
			<button
				onClick={handleClick}
				type="button"
				className="rounded bg-white px-3 py-1 text-blue-500 hover:bg-gray-100"
			>
				Click me
			</button>
			{query.data && <div className="mt-2">Result: {query.data}</div>}
			{query.isLoading && <div className="mt-2">Loading...</div>}
		</div>
	);
}
