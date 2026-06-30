exports.handler = async (event) => {
  try {
    const { photoBase64, photoSide } = JSON.parse(event.body);

    if (!photoBase64) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Foto non valida' })
      };
    }

    const base64Data = photoBase64.split(',')[1];
    const prompt = `Tu sei IRIDIO, Intelligenza Artificiale per Iridologia Olistica Avanzata. Analizza questa foto dell'iride secondo i 6 PILASTRI: 1) Iridologia Organica, 2) Psicosomatica, 3) Energetica, 4) Cronorischio, 5) Sclera, 6) Sistemica Familiare. Rispondi SOLO in JSON con chiavi: organic, psychosomatic, energetic, chronorisk, sclera, familial, summary, recommendations. NON aggiungere testo.`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 2500,
        messages: [{
          role: "user",
          content: [{
            type: "image",
            source: { type: "base64", media_type: "image/jpeg", data: base64Data }
          }, { type: "text", text: prompt }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    const analysisText = data.content[0].text;
    
    let analysis = {};
    try {
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      analysis = JSON.parse(jsonMatch[0]);
    } catch (e) {
      analysis = { organic: analysisText, psychosomatic: "", energetic: "", chronorisk: "", sclera: "", familial: "", summary: "Analisi completata", recommendations: "" };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(analysis)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
