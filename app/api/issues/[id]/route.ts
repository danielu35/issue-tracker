import { issueSchema, patchIssueSchema } from "@/app/validationSchemas";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from 'next-auth';
import authOptions from '@/app/auth/authOptions';

export async function PATCH(request: NextRequest, {params}: { params: { id: string }}) {
    const session = await getServerSession(authOptions);
    if (!session)
        return NextResponse.json({}, { status: 401 });

    const body = await request.json();
    const validation = patchIssueSchema.safeParse(body);
    if (!validation.success)
            return NextResponse.json(validation.error.format(), { status: 400 });

    const { title, description, status, assignedToUserId } = body;
    if (assignedToUserId) {
        const user = await prisma.user.findUnique({
            where: {
                id: assignedToUserId
            }
        })

    if (!user)
        return NextResponse.json({ error: "Invalid User" }, { status: 400 });
    }

    const issue = await prisma.issues.findUnique({
        where: { id: parseInt(params.id)}
    })

    if (!issue)
        return NextResponse.json({ error: 'Invalid issue' }, { status: 404 })

    const updatedIssue = await prisma.issues.update({
        where: { id: issue.id},
        data: {
            title,
            description,
            status,
            assignedToUserId
        }
    })

    return NextResponse.json(updatedIssue);
}

export async function DELETE(request: NextRequest, {params}: { params: { id: string }}) {
        const session = await getServerSession(authOptions);
    if (!session)
        return NextResponse.json({}, { status: 401 });

    const issue = await prisma.issues.findUnique({
        where: {id: parseInt(params.id)}
    })

    if (!issue)
        return NextResponse.json({ error: 'Invalid issue' }, { status: 404 });

    await prisma.issues.delete({
        where: { id: parseInt(params.id)}
    });

    return NextResponse.json({});
}