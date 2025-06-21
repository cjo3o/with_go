// const express = require('express');
// const router = express.Router();
// const axios = require('axios');
// require("dotenv").config();

// router.post("/pay", async (req, res) => {
//     try {
//         const { orderId, amount, orderName, customerName } = req.body;
//         const TossKey = process.env.TOSS_API_KEY;

//         const response = await axios.post(
//             "https://api.tosspayments.com/v1/payments",
//             {
//                 orderId,
//                 amount,
//                 orderName,
//                 customerName,
//                 successUrl: "http://localhost:5173/reservation.html?from=payment",
//                 failUrl: "http://localhost:5173/fail.html"
//             },
//             {
//                 headers: {
//                     Authorization: `Basic ${Buffer.from(TossKey + ':').toString('base64')}`,
//                     "Content-Type": "application/json"
//                 }
//             }
//         );
//         console.log("💳 Toss로 보내는 데이터:", {
//             orderId, amount, orderName, customerName,
//             successUrl: "...",
//             failUrl: "..."
//         });

//         res.json({ url: response.data.next_redirect_url });
//     } catch (err) {
//         console.error(err.response?.data || err.message);
//         res.status(500).json({ error: "Toss 결제 요청 실패" });
//     }
// });

// module.exports = router;

require("dotenv").config(); // .env 사용
const express = require("express");
const axios = require("axios");
const router = express.Router();

router.post("/pay", async (req, res) => {
    const { orderId, amount, orderName, customerName } = req.body;

    // 필수값 검증
    if (!orderId || !amount || !orderName || !customerName) {
        return res.status(400).json({ error: "누락된 필수 항목이 있습니다." });
    }

    try {
        // Toss 시크릿 키 → 반드시 .env 파일에 있어야 함
        const secretKey = process.env.TOSS_API_KEY;
        console.log("🔐 Toss 시크릿 키:", process.env.TOSS_API_KEY);
        const encodedKey = Buffer.from(`${secretKey}:`).toString("base64");

        const response = await axios.post(
            "https://api.tosspayments.com/v1/payments",
            {
                orderId: "order_" + new Date().getTime(),
                amount: 16000,
                orderName: "보관 예약 결제",
                customerName: "변준성",
                successUrl: "http://localhost:5173/reservation.html?from=payment",
                failUrl: "http://localhost:5173/fail.html"
            },
            {
                headers: {
                    Authorization: `Basic ${encodedKey}`,
                    "Content-Type": "application/json"
                }
            }
        );

        return res.json({ url: response.data.next_redirect_url });

    } catch (err) {
        console.error("❌ Toss 결제 실패:", err.response?.data || err.message);
        console.log("🚨 실패 요청 내용:", {
            orderId, amount, orderName, customerName,
            amountType: typeof amount,
            key: process.env.TOSS_API_KEY
        });
        res.status(500).json({ error: "Toss 결제 요청 실패", detail: err.response?.data });
    }
});

module.exports = router;
