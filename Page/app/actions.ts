'use server';

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';

export interface Question {
    id: number;
    answer_id: number;
    artista: string;
    nombre: string;
    sampling_url: string;
    urlYT: string;
}

export async function getPendingQuestion(): Promise<Question | null> {
    // Select a random question that IS in the Review table with status 1
    const stmt = db.prepare(`
    SELECT Q.* FROM Question Q
    JOIN Review R ON Q.id = R.question_id
    WHERE R.status = 1
    ORDER BY RANDOM()
    LIMIT 1
  `);

    const question = stmt.get() as Question | undefined;
    return question || null;
}

export async function submitReview(questionId: number, status: number) {
    const stmt = db.prepare(`
    INSERT OR REPLACE INTO Review (question_id, status)
    VALUES (?, ?)
  `);

    stmt.run(questionId, status);
    revalidatePath('/review');
}

export async function getReviewStats() {
    const totalStmt = db.prepare('SELECT COUNT(*) as count FROM Question');
    const reviewedStmt = db.prepare('SELECT COUNT(*) as count FROM Review');
    const keptStmt = db.prepare('SELECT COUNT(*) as count FROM Review WHERE status = 1');

    const total = totalStmt.get() as { count: number };
    const reviewed = reviewedStmt.get() as { count: number };
    const kept = keptStmt.get() as { count: number };

    return {
        total: total.count,
        reviewed: reviewed.count,
        kept: kept.count,
        remaining: total.count - reviewed.count
    };
}
