

import dbConnect from "@/lib/dbConnect";
import { verifyAuth } from "@/lib/auth";
import { NextResponse } from "next/server";
import ChatRoom from "@/models/ChatRoom";
import Message from "@/models/Message";
import User from "@/models/User";

export async function GET(request, { params }) { 
    try {
        await dbConnect();

        const user = await verifyAuth();
        if (!user) {
            return NextResponse.json({ success: false, message: "Akses ditolak." }, { status: 401 });
        }
        
        const { reportId } = params;

        const chatRoom = await ChatRoom.findOne({ reportId });
        if (!chatRoom || !chatRoom.participants.includes(user.id)) {
            return NextResponse.json({ success: false, message: "Chat room tidak ditemukan atau Anda bukan peserta." }, { status: 404 });
        }

        const messages = await Message.find({ chatRoomId: chatRoom._id })
            .populate('sender', 'namaLengkap peran')
            .sort({ createdAt: 'asc' });

        return NextResponse.json({ success: true, data: messages });
    } catch (error) {
        console.error("GET Messages Error:", error.message);
        return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 });
    }
}

export async function POST(request, { params }) {
    try {
        await dbConnect();

        const user = await verifyAuth();
        if (!user) {
            return NextResponse.json({ success: false, message: "Akses ditolak." }, { status: 401 });
        }
        
        const { reportId } = params;
        const { content } = await request.json();

        if (!content) {
            return NextResponse.json({ success: false, message: "Isi pesan tidak boleh kosong." }, { status: 400 });
        }

        const chatRoom = await ChatRoom.findOne({ reportId });
        if (!chatRoom || !chatRoom.participants.includes(user.id)) {
            return NextResponse.json({ success: false, message: "Chat room tidak ditemukan atau Anda bukan peserta." }, { status: 404 });
        }

        const newMessage = await Message.create({
            chatRoomId: chatRoom._id,
            sender: user.id,
            content: content,
        });

        const populatedMessage = await Message.findById(newMessage._id).populate('sender', 'namaLengkap peran');

        return NextResponse.json({ success: true, data: populatedMessage }, { status: 201 });
    } catch (error) {
        console.error("POST Message Error:", error.message);
        return NextResponse.json({ success: false, message: "Gagal mengirim pesan." }, { status: 500 });
    }
}