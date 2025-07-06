export const generateSummary = async (payload) => {
  try {
    console.log(payload, "generate summ");
    const messages = payload?.reduce(
      (acc, curr) => acc + ` ${curr?.role}: ${curr?.parts?.[0]?.text}.\n`,
      ""
    );
    console.log(messages, "generate summ");
    const res = await fetch("/api/get-summary", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages }),
    });

    if (!res.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await res.json();
    return data;
  } catch (err) {
    return {
      error:
        err.message || "An error occurred while fetching the chat response.",
    };
  }
};
