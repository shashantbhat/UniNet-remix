import { useParams, Form, useLoaderData } from "@remix-run/react";
import {
  LoaderFunctionArgs,
  json,
  ActionFunctionArgs,
  LoaderFunction,
} from "@remix-run/node";
import { useState } from "react";
import DashboardLayout from "~/components/dashboard_layout";
import pool from "~/utils/db.server";
import authenticator from "~/utils/auth.server";
import { GoogleGenerativeAI } from "@google/generative-ai"; // Use import instead of require

type FileDetails = {
  name: string;
  description: string;
  uploadedBy: string;
  uploadDate: string;
  downloadUrl: string;
  tags: { name: string; relevanceScore: number }[];
};

type Comment = {
  id: number;
  user: string;
  comment: string;
  rating: number;
};

export async function loader({ params }: LoaderFunctionArgs) {
  const client = await pool.connect();
  const result = await client.query("SELECT * FROM files WHERE id = $1", [
    params.fileid,
  ]);
  console.log(result.rows[0].title);
  const result1 = await client.query("SELECT * FROM users WHERE id = $1", [
    result.rows[0].uploader_id,
  ]);

  const fileDetails: FileDetails = {
    name: result.rows[0].title,
    description: result.rows[0].description,
    uploadedBy: result1.rows[0].name,
    uploadDate: result.rows[0].upload_date,
    downloadUrl: result.rows[0].file_url,
    tags: [],
  };

  const result2 = await client.query(
    "SELECT ratings.rater_id, ratings.rating, ratings.comment, ratings.created_at, users.name as rater_name FROM ratings JOIN users ON ratings.rater_id = users.id WHERE ratings.file_id = $1",
    [params.fileid]
  );
  const comments: Comment[] = result2.rows.map((row) => ({
    id: row.rater_id,
    user: row.rater_name,
    comment: row.comment,
    rating: row.rating,
  }));

  const result3 = await client.query(
    "SELECT file_tags.name, file_tag_assignments.relevance_score FROM file_tag_assignments JOIN file_tags ON file_tag_assignments.tag_id = file_tags.id WHERE file_tag_assignments.file_id = $1",
    [params.fileid]
  );
  fileDetails.tags = result3.rows.map((row) => ({
    name: row.name,
    relevanceScore: row.relevance_score,
  }));

  const genAI = new GoogleGenerativeAI(
    "AIzaSyAkBta4Gql98eHyenjI92zd4I-a_va11Fg"
  );
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const ratings = comments.map((comment) => comment.rating);
  const comments_text = comments.map((comment) => comment.comment);

  console.log(ratings);
  console.log(comments_text);

  const prompt = `
You are an AI model that analyzes user feedback. Below are the ratings and comments provided by users for a specific file with name ${
    fileDetails.name
  } and desciption ${
    fileDetails.description
  }. Please analyze the feedback and provide a summary indicating whether the overall sentiment towards the file is positive, negative, or neutral. Additionally, highlight any common themes or issues mentioned by the users.

Ratings:
${ratings.join(", ")}

Comments:
${comments_text.join("\n")}

Based on the above ratings and comments, what is the overall sentiment towards the file? Is the file generally considered good or bad by the users? Please provide a detailed analysis in 50 words.
`;

  let summary;
  try {
    const ratings_summary = await model.generateContent(prompt);
    summary = ratings_summary.response.text();
  } catch (error) {
    console.error("Error connecting to NLP Sentiment Analysis Server:", error);
    summary = "Error connecting to NLP Sentiment Analysis Server Error";
  }

  return json({ fileDetails, comments, summary });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const { id: userId } = await authenticator.isAuthenticated(request);

  console.log(formData.get("comment"));
  console.log(formData.get("rating"));
  console.log(userId);
  const client = await pool.connect();
  client.query(
    "INSERT INTO ratings (rater_id, file_id, rating, comment) VALUES ($1, $2, $3, $4)",
    [userId, params.fileid, formData.get("rating"), formData.get("comment")]
  );

  const result = await client.query(
    "SELECT AVG(rating) as average_rating FROM ratings WHERE file_id = $1",
    [params.fileid]
  );
  console.log(result.rows[0].average_rating);
  client.query("UPDATE files SET average_rating = $1 WHERE id = $2", [
    result.rows[0].average_rating,
    params.fileid,
  ]);

  return json({ success: true });
}

export default function Dashboard() {
  const { fileDetails, comments, summary } = useLoaderData<typeof loader>();
  const [rating, setRating] = useState(0);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">File Details</h1>

      {/* File Info and Download Section */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-5xl mb-2">
          <b>{fileDetails.name}</b>
        </h2>
        <h2 className="text-2xl mb-2">{fileDetails.description}</h2>
        <p className="mb-1">
          <b>Uploaded by:</b> {fileDetails.uploadedBy}
        </p>
        <p className="mb-1">
          <b>Date:</b> {fileDetails.uploadDate}
        </p>
        <p className="mb-1">
          <b >Tags:</b>
          <br />
          {fileDetails.tags.map((tag) => (
            <span
              key={tag.name}
              className="bg-gray-200 m-1 text-gray-700 px-3 py-1 rounded-full"
            >
              {tag.name} ({tag.relevanceScore} ★)
            </span>
          ))}
        </p>
        <p className="mb-1">
          <b>AI File Sentiment Analysis:</b>
          <br />
          {summary}
        </p>
        <div className="mt-5 mb-2">
          <a
            href={fileDetails.downloadUrl}
            className="border border-black bg-white text-black px-4 py-2 rounded-3xl hover:bg-black hover:text-white transition mr-1.5 w-full mt-2"
            download
          >
            Download File
          </a>
        </div>
      </div>

      {/* Previous Comments */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl mb-4">Previous Comments</h2>
        {comments.map((comment) => (
          <div key={comment.id} className="border-b py-3">
            <div className="flex items-center justify-between">
              <strong>{comment.user}</strong>
              <span className="text-black-400">
                {"★".repeat(comment.rating)}
                {" ("}
                {comment.rating}
                {"/5)"}
              </span>
            </div>
            <p className="mt-2">{comment.comment}</p>
          </div>
        ))}
      </div>
      {/* Add Comment */}
      <Form method="post" className="bg-white p-4 rounded-lg shadow mt-6">
        <div className="mb-4">
          <label className="block mb-2">Rating:</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-2xl ${
                  rating >= star ? "text-black-400" : "text-gray-300"
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>
        <input type="hidden" name="rating" value={rating} />
        <textarea
          name="comment"
          className="w-full border p-2 rounded"
          placeholder="Write your comment..."
          rows={3}
        />
        <button
          type="submit"
          className="border border-black bg-white text-black px-4 py-2 rounded-3xl hover:bg-black hover:text-white transition mr-1.5 mt-2"
        >
          Submit Review
        </button>
      </Form>
    </div>
  );
}
