import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async (req, context) => {
    if (req.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 });
    }

    try {
        const { name, inquiryType, message } = await req.json();

        if (!name || !inquiryType || !message) {
            return new Response(JSON.stringify({ error: 'Missing required fields' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const { data, error } = await resend.emails.send({
            from: 'Contact Form <onboarding@resend.dev>', // Fallback to onboarding if domain not verified
            reply_to: 'contact@zacharyroulier.com',
            to: 'zwroulierbusiness@gmail.com',
            subject: `New Inquiry: ${inquiryType} from ${name}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #2A2A2A;">
                    <h2 style="font-weight: 300; border-bottom: 1px solid #eee; padding-bottom: 10px;">New Contact Inquiry</h2>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Inquiry Type:</strong> ${inquiryType}</p>
                    <div style="margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-left: 4px solid #7D7259;">
                        <p style="margin: 0; white-space: pre-wrap;">${message}</p>
                    </div>
                </div>
            `
        });

        if (error) {
            console.error('Detailed Resend Error:', JSON.stringify(error, null, 2));
            return new Response(JSON.stringify({ error: error.message, detail: error }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        console.log('Email sent successfully via Resend:', data.id);
        return new Response(JSON.stringify({ success: true, id: data.id }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Server Error:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
