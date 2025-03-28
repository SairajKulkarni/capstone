import * as cheerio from "cheerio";
import Certificate from "../models/Certificate.js";
import User from "../models/User.js";

const verificationAPIs = {
  aws: async (id, name) => {
    const apiResponse = await fetch(
      `https://api.certmetrics.com/amazon/verification/certification/${id}`
    );
    if (!apiResponse.ok) return 404;
    const responseData = await apiResponse.json();
    if (
      responseData.certStatus === "Active" &&
      `${responseData.firstName} ${responseData.lastName}` === name
    )
      return 200;
    return 401;
  },

  coursera: async (id, name) => {
    const apiResponse = await fetch(`https://coursera.org/verify/${id}`);
    const responseData = await apiResponse.text();
    const $ = cheerio.load(responseData);
    const responseUser = $("h3 > span > strong").text().trim();
    if (responseUser !== "") return responseUser === name ? 200 : 401;
    return 404;
  },

  courseraProfessional: async (id, name) => {
    const apiResponse = await fetch(
      `https://coursera.org/verify/professional-cert/${id}`
    );
    const responseData = await apiResponse.text();
    const $ = cheerio.load(responseData);
    const responseUser = $("h3 > span > strong").text().trim();
    if (responseUser !== "") return responseUser === name ? 200 : 401;
    return 404;
  },

  redhat: async (id, name) => {
    const apiResponse = await fetch(
      `https://rhtapps.redhat.com/verify?certId=${id}`
    );
    const responseData = await apiResponse.text();
    const $ = cheerio.load(responseData);
    const responseUser = $("tbody")
      .first()
      .find("tr")
      .last()
      .find("td")
      .last()
      .text()
      .trim();
    if (responseUser !== "") return responseUser === name ? 200 : 401;
    return 404;
  },

  cisco: async (id, name) => {
    const apiResponse = await fetch(
      `https://api.certmetrics.com/cisco/verification/certification/${id}`
    );
    if (!apiResponse.ok) return 404;
    const responseData = await apiResponse.json();
    if (
      responseData.certStatus === "Active" &&
      `${responseData.firstName} ${responseData.lastName}` === name
    )
      return 200;
    return 401;
  },

  hpe: async (id, name) => {
    const apiResponse = await fetch(
      `https://hpepro.ext.hpe.com/certificate/get-certificate-data/${id}`
    );
    const responseData = await apiResponse.text();
    const $ = cheerio.load(responseData);
    const notFound = $("h4");
    if (notFound.text().trim() === "Not Verified / Not Found in Records.")
      return 404;
    return 200;
  },
};

export const verifyCeriticate = async (req, res) => {
  const { certName, organization, certId, issueDate, expiryDate } = req.body;
  const availableOrganisations = Object.keys(verificationAPIs);
  let verificationResponse = 200;
  let isVerified = false;

  if(!organization.value)
    return res.status(400).json({message: "No organization"});

  try {
    if (availableOrganisations.includes(organization.value)) {
      verificationResponse = await verificationAPIs[organization.value](
        certId,
        req.user.name
      );
      isVerified = true;
    }
    switch (verificationResponse) {
      case 200:
        const newCertificate = new Certificate({
          owner: req.user.id,
          certName: certName,
          organization: organization.label,
          certificateId: certId,
          issueDate: issueDate,
          expiryDate: expiryDate,
          isVerified: isVerified,
        });
        await newCertificate.save();
        // console.log(newCertificate);
        const updatedUser = await User.findByIdAndUpdate(
          req.user.id,
          {
            $push: { certificates: newCertificate._id },
          },
          { new: true }
        );
        res.status(200).json({ message: "Certificate added", newCertificate });
        break;
      case 401:
        res.status(401).json({ message: "Not the owner" });
        break;
      case 404:
        res.status(404).json({ message: "Not found" });
        break;
      default:
        res.status(500).json({ message: "Internal Server Error" });
        break;
    }
  } catch (error) {
    // console.error("Error verifying", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
