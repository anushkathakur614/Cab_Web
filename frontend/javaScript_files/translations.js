const translations = {
    english: {
        heroTitle: "Reliable Cab Service for Every Journey",
        heroDesc: "Safe, comfortable and affordable rides."
    },

    hindi: {
        heroTitle: "हर यात्रा के लिए विश्वसनीय कैब सेवा",
        heroDesc: "सुरक्षित, आरामदायक और किफायती यात्रा।"
    }
};

let currentLanguage =
    localStorage.getItem("language") || "english";

function applyLanguage(lang){

    document.getElementById("heroTitle").innerText =
        translations[lang].heroTitle;

    document.getElementById("heroDesc").innerText =
        translations[lang].heroDesc;
}

applyLanguage(currentLanguage);