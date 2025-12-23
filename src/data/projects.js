export const DATA = {
  intro: {
    line1: "Capturing",
    line2: "Perspectives",
    line3: "From Above"
  },
  projects: [
    {
      id: 'dolomiti',
      title: 'DOLOMITI',
      subtitle: 'Italian Alpine Peaks',
      coords: { lat: 46.5400, lng: 11.6100 },
      year: '2024',
      previewVideo: "https://vimeo.com/1143263477", // Place file in public/videos/
      images: [
        {
          src: 'https://i.imgur.com/kfNO0iJ.jpg',
          details: { drone: "DJI Mini 4 Pro", settings: "auto", postProcessing: "none" }
        },
        {
          src: 'https://imgur.com/Alu1OEg.jpg',
          details: { drone: "DJI Mini 4 Pro", settings: "auto", postProcessing: "none" }
        },
        {
          src: 'https://imgur.com/9zKImpt.jpg',
          details: { drone: "DJI Mini 4 Pro", settings: "auto", postProcessing: "none" }
        },
        {
          src: 'https://imgur.com/vBtdrcB.jpg',
          details: { drone: "DJI Mini 4 Pro", settings: "auto", postProcessing: "color grading, photoshop (moon)" }
        },
      ],
      description: "A tour through the Italian Dolomites. The peaks of the Dolomites are a collection of limestone mountains in northeastern Italy."
    },
    {
      id: 'aspen',
      title: 'ASPEN',
      subtitle: 'Fall Foliage',
      coords: { lat: 39.1900, lng: -106.8200 },
      year: '2025',
      previewVideo: "https://vimeo.com/1143263323", // Place file in public/videos/
      images: [
        {
          src: 'https://imgur.com/wTKWhxH.jpg',
          details: { drone: "DJI Air 3S", settings: "auto", postProcessing: "none" }
        },
        {
          src: 'https://imgur.com/LLD61GE.jpg',
          details: { drone: "DJI Air 3S", settings: "auto", postProcessing: "none" }
        },
        {
          src: 'https://imgur.com/BCEwLLd.jpg',
          details: { drone: "DJI Air 3S", settings: "auto", postProcessing: "none" }
        },
        {
          src: 'https://imgur.com/FyBCgmt.jpg',
          details: { drone: "DJI Air 3S", settings: "auto", postProcessing: "none" }
        },
        {
          src: 'https://imgur.com/yaHqBPr.jpg',
          details: { drone: "DJI Air 3S", settings: "auto", postProcessing: "none" }
        },
        {
          src: 'https://imgur.com/Om3NMfF.jpg',
          details: { drone: "DJI Air 3S", settings: "auto", postProcessing: "none" }
        },
      ],
      videoUrl: "https://www.youtube.com/embed/Ls4uBZI7ieA", // INSERT VIDEO LINK HERE
      description: "A tour through Aspen during peak fall foliage. This typically occurs in late September. Scroll to the end for a short cinematic video!"
    },
    {
      id: 'keukenhof',
      title: 'KEUKENHOF',
      subtitle: 'Tulip Fields in Amsterdam',
      coords: { lat: 52.2600, lng: 4.5400 },
      year: '2024',
      previewVideo: "https://vimeo.com/1143263616", // Place file in public/videos/
      images: [
        {
          src: 'https://imgur.com/n4aAv4y.jpg',
          details: { drone: 'DJI Mini 4 Pro', settings: 'auto', postProcessing: 'none' }
        },
        {
          src: 'https://imgur.com/AqADiZB.jpg',
          details: { drone: 'DJI Mini 4 Pro', settings: 'auto', postProcessing: 'none' }
        },
        {
          src: 'https://imgur.com/qaFoTtx.jpg',
          details: { drone: 'DJI Mini 4 Pro', settings: 'auto', postProcessing: 'none' }
        },
        {
          src: 'https://imgur.com/Kknpq08.jpg',
          details: { drone: 'DJI Mini 4 Pro', settings: 'auto', postProcessing: 'none' }
        },
      ],
      description: "Visiting the vibrant tulip fields of Keukenhof in Amsterdam. Peak tulip season typicallyoccurs in late April."
    }
  ],
  gallery: [
    {
      id: 1,
      src: 'https://imgur.com/JcYMLbs.jpg',
      location: 'Toledo',
      coords: { lat: 39.8600, lng: -4.0200 },
      year: '2024',
      orientation: 'landscape'
    },
    {
      id: 2,
      src: 'https://imgur.com/24ww2T8.jpg',
      location: 'Denver',
      coords: { lat: 39.7300, lng: -104.9900 },
      year: '2024',
      orientation: 'portrait'
    },
    {
      id: 3,
      src: 'https://imgur.com/MOpItb5.jpg',
      location: 'Lisboa',
      coords: { lat: 38.7200, lng: -9.1300 },
      year: '2024',
      orientation: 'landscape'
    },
    {
      id: 4,
      src: 'https://imgur.com/Hdj46ri.jpg',
      location: 'Valencia',
      coords: { lat: 39.4748, lng: -0.3756 },
      year: '2024',
      orientation: 'landscape'
    },
    {
      id: 5,
      src: 'https://imgur.com/NCGqQX6.jpg',
      location: 'Vienna',
      coords: { lat: 48.2000, lng: 16.3700 },
      year: '2024',
      orientation: 'landscape'
    },
    {
      id: 6,
      src: 'https://imgur.com/9S6b50E.jpg',
      location: 'Swiss Alps',
      coords: { lat: 46.5600, lng: 8.0100 },
      year: '2024',
      orientation: 'portrait'
    },
    {
      id: 7,
      src: 'https://imgur.com/7uXwKYO.jpg',
      location: 'Denver',
      coords: { lat: 39.7300, lng: -104.9900 },
      year: '2024',
      orientation: 'portrait'
    },
    {
      id: 8,
      src: 'https://imgur.com/mH1BSUD.jpg',
      location: 'Sevilla',
      coords: { lat: 37.3667, lng: -5.0000 },
      year: '2024',
      orientation: 'portrait'
    }
  ]
};
