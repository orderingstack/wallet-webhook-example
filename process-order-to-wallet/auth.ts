import axios from 'axios'

export async function getToken() {
    // get token from Oauth Api for tenants backend(super) user (allowed to create other users)
    const request: any = { 
        url: `${process.env.BASE_URL}/auth-oauth2/oauth/token`, 
        method: 'POST',
        headers: {
            'x-tenant': process.env.TENANT,
            'Authorization': `Basic ${process.env.BASIC_AUTH}`,
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',            
        },
        data: `username=${process.env.WALLET_USER_NAME}&password=${process.env.WALLET_USER_PASS}&grant_type=password&scope=read`,
    }
    const oauthResponse = await axios(request);
    //console.log(oauthResponse.data)
    const { access_token } = oauthResponse.data;
    //console.log( access_token);
    return access_token;
}
 