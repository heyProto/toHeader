var SSR = require('./dist/0.0.1/ssr-card.min.js')
var state = {
    "dataJSON": {
        "data":
        {
            "url": "https://thewire.in/210310/japan-cleaning-sanitation-work-swachh-bharat/",
            "headline": "Zen and the Art of Sanitation, or the Right Way to Keep a Country Clean",
            "byline": "Janaki Nair",
            "publishedat": "2018-01-03T06:30:00.000Z",
            "series": "Grit",
            "genre": "Identity",
            "subgenre": "Sample subgenre",
            "iconbgcolor": "white",
            "hasimage": true,
            "byline_image":"http://localhost:8080/cards-version-04/by-image.png",
            "hasvideo": true,
            "hasaudio": false,
            "hasdata": false,
            "interactive": true,
            "summary": "In Japan, cleaning is a public service to be performed by everyone, not relegated to one marginalised section of the society.",
            "imageurl": "https://utils.pro.to/images/TheWire/e55455ef9128e35c/2240.jpeg",
            "col7imageurl": "https://utils.pro.to/images/TheWire/97a9ab4c73ec44c4/2239.png",
            "focus": "h",
            "country": "Sample country",
            "state": "Sample state",
            "city": "Sample city",
            "publishername": "The Wire",
            "domainurl": "thewire.in",
            "faviconurl": "https://i0.wp.com/thewire.in/wp-content/uploads/2015/05/facebook-profile-pic2-554e49d7v1_site_icon.png?fit=32%2C32\u0026ssl=1",
            "isinteractive": true,
            "top": 50,
            "left": 50
        }
    }
}
let x = SSR.render("section", state);
console.log(x);