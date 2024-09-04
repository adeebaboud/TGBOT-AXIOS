    const axios = require("axios");
    const BOT_TOKEN = "7297180874:AAGAMiLEJOZSyKDPkULegLU3vm-s_zFjoow";

    const BASE_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

    function getAxiosInstance() { 
        return  { 
            get(method, params) { 
                return axios.get(`/${method}` , { 
                    baseURL: BASE_URL,
                    params,
                })
            }, 
            post(method,data) { 
                return axios({
                    method: "post",
                    baseURL: BASE_URL,
                    url: `/${method}`,
                    data
                });
            }

        }
    }

    module.exports = { axiosInstance: getAxiosInstance() };