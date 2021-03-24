const dhl = require('./lib/index');
const fs = require('fs');
const format = require('xml-formatter');
const request = require('request');
const auth = {
    username:"username",
    password:"password",
    accountNumber:000000,
}
const req = {
    ClientDetail: {
    },
    RequestedShipment: {
        DropOffType: 'REQUEST_COURIER',
        Ship: {
            Shipper: {
                StreetLines: '1-16-24, Minami-gyotoku',
                City: 'Ichikawa-shi, Chiba',
                PostalCode: '272-0138',
                CountryCode: 'JP',
            },
            Recipient: {
                StreetLines: '63 RENMIN LU, QINGDAO SHI',
                City: 'QINGDAO SHI',
                PostalCode: '266033',
                CountryCode: 'CN',
            },
        },
        Packages: {
            RequestedPackages: {
                attributes: {
                    number: 1,
                },
                Weight: {
                    Value: 2,
                },
                Dimensions: {
                    Length: 13,
                    Width: 12,
                    Height: 9,
                },
            },
        },
        ShipTimestamp: dhl.getIsoDateTimeGmt(),
        UnitOfMeasurement: 'SU',
        Content: 'NON_DOCUMENTS',
        DeclaredValue: 200,
        DeclaredValueCurrecyCode: 'USD',
        PaymentInfo: 'DDP',
        Account: auth.accountNumber,
    },
};
(async function() {
    const res = await dhl.testRateRequest(auth, req);
    fs.writeFileSync('rateRequest.response.xml', res.responseXml);
    fs.writeFileSync('rateRequest.request.xml', format(res.requestXml));

    // getRateRequest();
})();

function getRateRequest(){
    const baseUrl = "https://wsbexpress.dhl.com/sndpt/expressRateBook";
    const now = new Date()
    const username = auth.username;
    const password = auth.password;
    const accountNumber = auth.accountNumber;
    const currentDate = dhl.getDate(now);
    const expiredDate = dhl.getDate(new Date(now.getTime() + (1000 * 600)));
    const dateTimeGmt = dhl.getIsoDateTimeGmt().replace(/ /g,'');
    let body = `
    <?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:s0="http://scxgxtt.phx-dc.dhl.com/euExpressRateBook/providerServices/ShipmentHandlingServices" xmlns:s1="http://scxgxtt.phx-dc.dhl.com/euExpressRateBook/RateMsgRequest" xmlns:s2="http://scxgxtt.phx-dc.dhl.com/euExpressRateBook/RateMsgResponse" xmlns:s3="http://scxgxtt.phx-dc.dhl.com/euExpressRateBook/ShipmentMsgResponse" xmlns:s4="http://scxgxtt.phx-dc.dhl.com/euExpressRateBook/DeleteShipmentRequest" xmlns:s5="http://scxgxtt.phx-dc.dhl.com/euExpressRateBook/DeleteShipmentResponse" xmlns:s6="http://www.reactivity.com/xsdbundle/" xmlns:tm="http://microsoft.com/wsdl/mime/textMatching/" xmlns:tns="http://scxgxtt.phx-dc.dhl.com/euExpressRateBook/ShipmentMsgRequest">
    <soap:Header>
        <wsse:Security xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">
            <wsu:Timestamp wsu:Id="Timestamp-${currentDate}">
                <wsu:Created>
                    ${currentDate}
                </wsu:Created>
                <wsu:Expires>
                    ${expiredDate}
                </wsu:Expires>
            </wsu:Timestamp>
            <wsse:UsernameToken xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd" wsu:Id="SecurityToken-${currentDate}">
                <wsse:Username>
                    ${username}
                </wsse:Username>
                <wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">
                    ${password}
                </wsse:Password>
                <wsu:Created>
                    ${currentDate}
                </wsu:Created>
            </wsse:UsernameToken>
        </wsse:Security>
    </soap:Header>
    <soap:Body>
        <s1:RateRequest xmlns:s1="http://scxgxtt.phx-dc.dhl.com/euExpressRateBook/RateMsgRequest">
            <ClientDetail>
            </ClientDetail>
            <RequestedShipment>
                <DropOffType>
                    REQUEST_COURIER
                </DropOffType>
                <Ship>
                    <Shipper>  
                        <StreetLines>
                            1-16-24, Minami-gyotoku
                        </StreetLines>
                        <City>
                            Ichikawa-shi, Chiba
                        </City>
                        <PostalCode>
                            272-0138
                        </PostalCode>
                        <CountryCode>
                            JP
                        </CountryCode>
                    </Shipper>
                    <Recipient>
                        <StreetLines>
                            63 RENMIN LU, QINGDAO SHI
                        </StreetLines>
                        <City>
                            QINGDAO SHI
                        </City>
                        <PostalCode>
                            266033
                        </PostalCode>
                        <CountryCode>
                            CN
                        </CountryCode>
                    </Recipient>
                </Ship>
                <Packages>
                    <RequestedPackages number="1">
                        <Weight>
                            <Value>
                                2
                            </Value>
                        </Weight>
                        <Dimensions>
                            <Length>
                                13
                            </Length>
                            <Width>
                                12
                            </Width>
                            <Height>
                                9
                            </Height>
                        </Dimensions>
                    </RequestedPackages>
                </Packages>
                <ShipTimestamp>
                    ${dateTimeGmt}
                </ShipTimestamp>
                <UnitOfMeasurement>
                    SU
                </UnitOfMeasurement>
                <Content>
                    NON_DOCUMENTS
                </Content>
                <DeclaredValue>
                    200
                </DeclaredValue>
                <DeclaredValueCurrecyCode>
                    USD
                </DeclaredValueCurrecyCode>
                <PaymentInfo>
                    DDP
                </PaymentInfo>
                <Account>
                    ${accountNumber}
                </Account>
            </RequestedShipment>
        </s1:RateRequest>
    </soap:Body>
</soap:Envelope>
    `;
    body = body.replace(/  /g,'').replace(/\n/g,'');
    const options = { 
        method:'post',
        headers:{
            "Host":"wsbexpress.dhl.com",
            "Connection":"close",
            "Accept-Charset":"utf-8",
            "Accept-Encoding":"none",
            "User-Agent":"node-request",
            "Accept":"text/html,application/xhtml+xml,application/xml,text/xml;q=0.9,*/*;q=0.8",
            "Content-Length":String(body).length,
            "Content-Type":"text/xml; charset=utf-8",
            "SOAPAction":'"euExpressRateBook_providerServices_ShipmentHandlingServices_Binder_getRateRequest"'
        },
        body
    } 
    request(baseUrl,options,(err,response)=>{
        let success = String(response.body).indexOf('rateresp:RateResponse');
        if(success != -1){
            console.log(response.body);
            console.log("success");
        }else{
            console.log("fail");
        }
    });
}