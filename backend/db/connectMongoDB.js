import mongoose from 'mongoose';

const connectMongoDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connect with the host : ${conn.connection.host}`)
    }catch (error) {
        console.error(`Error Message: ${error.message}`);
        process.exit(1);
    }
    
}

export default connectMongoDB;