// Arquivo: netlify/functions/sitemap.js

const { initializeApp } = require("firebase/app");
const { getDatabase, ref, get } = require("firebase/database");

// Cole sua configuração do Firebase aqui
const firebaseConfig = {
    apiKey: "AIzaSyD1O6KzJVLh5RshdgPCII9BaJyBZyGc2ho",
    authDomain: "amogalinha-d393e.firebaseapp.com",
    databaseURL: "https://amogalinha-d393e-default-rtdb.firebaseio.com",
    projectId: "amogalinha-d393e",
    storageBucket: "amogalinha-d393e.appspot.com",
    messagingSenderId: "741378248192",
    appId: "1:741378248192:web:7c84327d97391122df92e5"
};

const SITE_URL = 'https://jinoca.com';
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

exports.handler = async (event, context) => {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

    try {
        // Homepage
        xml += `
            <url>
                <loc>${SITE_URL}/</loc>
                <changefreq>daily</changefreq>
                <priority>1.0</priority>
            </url>`;

        // Página Adicionar Grupo
        xml += `
            <url>
                <loc>${SITE_URL}/add-group</loc>
                <changefreq>weekly</changefreq>
                <priority>0.8</priority>
            </url>`;

        // Grupos do Database
        const groupsRef = ref(db, 'groups');
        const groupsSnapshot = await get(groupsRef);
        const groups = groupsSnapshot.val();

        if (groups) {
            Object.keys(groups).forEach(groupId => {
                xml += `
                    <url>
                        <loc>${SITE_URL}/group/${groupId}</loc>
                        <changefreq>weekly</changefreq>
                        <priority>0.9</priority>
                    </url>`;
            });
        }

        xml += '</urlset>';
        
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/xml' },
            body: xml
        };

    } catch (error) {
        console.error("Erro ao gerar sitemap:", error);
        return { statusCode: 500, body: "Erro ao gerar sitemap." };
    }
};
