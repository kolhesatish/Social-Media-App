import { CiImageOn } from "react-icons/ci";
import { RiAiGenerate2 } from "react-icons/ri";
import { IoCloseSharp } from "react-icons/io5";
import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import axios from "axios";

const CreatePost = () => {
	const [text, setText] = useState("");
	const [img, setImg] = useState(null);
	const [prompt, setPrompt] = useState("");
	const [isPromptOpen, setIsPromptOpen] = useState(false); // Controls pop-up visibility
	const [loading, setLoading] = useState(false);
	const imgRef = useRef(null);

	const { data: authUser } = useQuery({ queryKey: ["authUser"] });
	const queryClient = useQueryClient();

	const { mutate: createPost, isPending, isError, error } = useMutation({
		mutationFn: async ({ text, img }) => {
			const res = await fetch("/api/posts/create", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ text, img }),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Something went wrong");
			return data;
		},
		onSuccess: () => {
			setText("");
			setImg(null);
			toast.success("Post created successfully");
			queryClient.invalidateQueries({ queryKey: ["posts"] });
		},
	});

	// Generate text from AI
	const handleGenerate = async () => {
		if (!prompt.trim()) {
			alert("Please enter a prompt");
			return;
		}
		setLoading(true);
		try {
			const res = await axios.post("/api/posts/generate", { prompt });
			setText(res.data.generatedContent);
			setPrompt("");
			setIsPromptOpen(false); // Close pop-up after generating
		} catch (error) {
			console.error("Error fetching response:", error);
			toast.error("Failed to generate text. Try again.");
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		createPost({ text, img });
	};

	const handleImgChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => setImg(reader.result);
			reader.readAsDataURL(file);
		}
	};

	return (
		<div className='flex p-4 items-start gap-4 border-b border-gray-700'>
			<div className='avatar'>
				<div className='w-8 rounded-full'>
					<img src={authUser?.profileImg || "/avatar-placeholder.png"} />
				</div>
			</div>

			<form className='flex flex-col gap-2 w-full' onSubmit={handleSubmit}>
				<textarea
					className='textarea w-full p-0 text-lg resize-none border-none focus:outline-none border-gray-800'
					placeholder='What is happening?!'
					value={text}
					onChange={(e) => setText(e.target.value)}
				/>

				{img && (
					<div className='relative w-72 mx-auto'>
						<IoCloseSharp
							className='absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer'
							onClick={() => {
								setImg(null);
								imgRef.current.value = null;
							}}
						/>
						<img src={img} className='w-full mx-auto h-72 object-contain rounded' />
					</div>
				)}

				<div className='flex justify-between border-t py-2 border-t-gray-700'>
					<div className='flex gap-1 items-center'>
						<CiImageOn className='fill-primary w-6 h-6 cursor-pointer' onClick={() => imgRef.current.click()} />
						<RiAiGenerate2 className='fill-primary w-5 h-5 cursor-pointer' onClick={() => setIsPromptOpen(true)} />
					</div>
					<input type='file' accept='image/*' hidden ref={imgRef} onChange={handleImgChange} />
					<button className='btn btn-primary rounded-full btn-sm text-white px-4' disabled={isPending}>
						{isPending ? "Posting..." : "Post"}
					</button>
				</div>
				{isError && <div className='text-red-500'>{error.message}</div>}
			</form>

			{/* AI Prompt Pop-Up Modal */}
			{isPromptOpen && (
				<div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
					<div className='bg-gray-800 p-5 rounded-lg shadow-lg w-96'>
						<h2 className='text-lg font-semibold text-white mb-3'>Enter AI Prompt</h2>
						<textarea
							className='textarea w-full p-2 text-lg resize-none border border-gray-600 focus:outline-none'
							placeholder='Type your prompt here...'
							value={prompt}
							onChange={(e) => setPrompt(e.target.value)}
						/>
						<div className='flex justify-end gap-2 mt-3'>
							<button className='btn btn-secondary' onClick={() => setIsPromptOpen(false)}>Cancel</button>
							<button className='btn btn-primary text-white px-4' onClick={handleGenerate} disabled={loading}>
								{loading ? "Generating..." : "Generate"}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default CreatePost;
