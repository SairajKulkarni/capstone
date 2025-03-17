import * as cheerio from "cheerio";

const verificationAPIs = {
  aws: async (id, res, name) => {
    const apiResponse = await fetch(
      `https://api.certmetrics.com/amazon/verification/certification/${id}`
    );
    if (!apiResponse.ok)
      return res.status(404).json({ verified: false, data: null });
    const responseData = await apiResponse.json();
    if (responseData.certStatus === "Active")
      return res.status(200).json({ verified: true, data: responseData });
    return res.status(404).json({ verified: false, data: responseData });
  },

  coursera: async (id, res, name) => {
    const apiResponse = await fetch(`https://coursera.org/verify/${id}`);
    const responseData = await apiResponse.text();
    const $ = cheerio.load(responseData);
    const responseUser = $("h3 > span > strong").text().trim();
    if (responseUser === "") return res.status(404).json({ verified: false });
    if (responseUser === name) return res.status(200).json({ verified: true });
    return res.status(404).json({ verified: false });
  },

  courseraProfessional: async (id, res, name) => {
    const apiResponse = await fetch(
      `https://coursera.org/verify/professional-cert/${id}`
    );
    const responseData = await apiResponse.text();
    const $ = cheerio.load(responseData);
    const responseUser = $("h3 > span > strong").text().trim();
    if (responseUser === "") return res.status(404).json({ verified: false });
    if (responseUser === name) return res.status(200).json({ verified: true });
    return res.status(404).json({ verified: false });
  },
};

export const verifyCeriticate = async (req, res) => {
  const { company, id } = req.body;
  try {
    return await verificationAPIs[company](id, res, req.user.name);
  } catch (error) {
    console.error("Error verifying", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
