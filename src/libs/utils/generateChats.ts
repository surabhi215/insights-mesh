export const fetchChatResponse = async (payload: any) => {
  try {
    const res = await fetch("/api/send-message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ payload }),
    });

    if (!res.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await res.json();
    return data;
  } catch (err: any) {
    return {
      error:
        err.message || "An error occurred while fetching the chat response.",
    };
  }
};
