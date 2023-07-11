import type { FC, ChangeEvent, Dispatch, SetStateAction } from "react";
import { useState } from "react";
import { api } from "~/utils/api";
import { type TPost } from "~/pages";
import { formatDistance } from "date-fns";

type TForm = {
    setPosts: Dispatch<SetStateAction<TPost[]>>;
};

export const Form: FC<TForm> = ({ setPosts }) => {
    const creatPost = api.posts.createPost.useMutation();
    const [form, setForm] = useState({ title: "", content: "" });

    const handleCreate = () => {
        creatPost.mutate(form, {
            onSuccess(data) {
                const finalData = {
                    ...data,
                    createdAt: formatDistance(
                        new Date(data.createdAt),
                        new Date()
                    ),
                    updatedAt: formatDistance(
                        new Date(data.updatedAt),
                        new Date()
                    ),
                };

                // console.log(data);
                setPosts((prev) => [finalData, ...prev]);
                setForm({ content: "", title: "" });
            },
        });
    };

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <>
            <div className="m-5 flex flex-col items-center rounded-2xl bg-white p-5 shadow-xl">
                <p className="text-[20px] font-semibold">Form</p>
                <input
                    type="text"
                    name="title"
                    id="title"
                    placeholder="Title"
                    className="mt-4 rounded-md border px-3 py-1"
                    onChange={onChange}
                    value={form.title}
                />
                <input
                    type="text"
                    name="content"
                    id="content"
                    placeholder="Content"
                    className="mt-4 rounded-md border px-3 py-1"
                    onChange={onChange}
                    value={form.content}
                />
                <button
                    onClick={handleCreate}
                    className="mt-4 rounded-lg bg-gray-800 px-3 py-1 text-white"
                >
                    Create
                </button>
            </div>
        </>
    );
};
