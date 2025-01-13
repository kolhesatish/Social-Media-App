import Notification from "../models/notification.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";


export const createPost = async (req, res) => {
    try {

        const { text} = req.body;
        let { image } = req.body;
        const userId = req.user._id.toString();

        const user= await User.findById(userId);

        if(!user) return res.status(400).json({ error: "User not found" });

        if(!text && !image) return res.status(400).json({ error: "Text or image are required" });

        if(image) {
            const uploadedResponse = await cloudinary.uploader.upload(image);
            image = uploadedResponse.secure_url;
        }

        const post = new Post({
            user: userId,
            text,
            image,
        });

        await post.save();
        res.status(201).json({ post});        
    } catch (error) {
        console.log("Error in createPost Controller: ", error.message);
        res.status(500).json("Internal Server error: ", error );
    }
}

export const deletePost = async (req, res) => {
    try {

        const post = await Post.findById(req.params.id);
        if(!post) return res.sendStatus(404).json({error: "post not found"});

        if(post.user.toString() !== req.user._id.toString()) return res.status(401).json({error: "You are not authorized to delete this post"});

        if(post.image) {
            const publicId = post.image.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(publicId);
        }

        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({message: "post deleted Successfully"});

    } catch (error) {
        console.log("Error in deletePost Controller: ", error.message);
        res.status(500).json("Internal Server error: ", error );        
    }
}

export const commentOnPost = async (req, res) => {
    try {
        const { text } = req.body;
        const userId = req.user._id;
        const postId = req.params.id;

        if(!text) return res.status(400).json({error: "text is required"});

        const post = await Post.findById(postId);

        if(!post) return res.status(404).json({error: "post is not found"});

        post.comments.push({ text, user: userId });

        await post.save();

        res.status(200).json({post});

    } catch (error) {
        console.log("Error in commentOnPost Controller: ", error.message);
        res.status(500).json("Internal Server error: ", error );        
        
    }
}


export const likeUnlikePost = async (req, res) => {
	try {
		const userId = req.user._id;
		const { id: postId } = req.params;

		const post = await Post.findById(postId);

		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		const userLikedPost = post.likes.includes(userId);

		if (userLikedPost) {
			// Unlike post
			await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
			await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });

			const updatedLikes = post.likes.filter((id) => id.toString() !== userId.toString());
			res.status(200).json(updatedLikes);
		} else {
			// Like post
			post.likes.push(userId);
			await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } });
			await post.save();

			const notification = new Notification({
				from: userId,
				to: post.user,
				type: "like",
			});
			await notification.save();

			const updatedLikes = post.likes;
			res.status(200).json(updatedLikes);
		}
	} catch (error) {
		console.log("Error in likeUnlikePost controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
			.sort({ createdAt: -1 })
			.populate({
				path: "user",
				select: "-password",
			})
			.populate({
				path: "comments.user",
				select: "-password",
			});

        if(posts.length === 0) return res.status(200).json([]);

        res.status(200).json(posts);

    } catch(error) {
        console.log("Error in getAllPosts Controller: ", error.message);
        res.status(500).json("Internal Server error: ", error );
    }
}