import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
    const { table } = req.query;

    const allowedTables = ['articles', 'events', 'feedback'];
    if (!allowedTables.includes(table)) {
        return res.status(403).json({ error: 'Unauthorized table' });
    }

    const { data, error } = await supabase.from(table).select('*');

    if (error) return res.status(500).json({ error: error.message });

    return res.status(200).json(data);
}
