export const DATA = {
  intro: {
    line1: "Capturing",
    line2: "Perspectives",
    line3: "From Above"
  },
  projects: [
    {
      id: 'italy',
      title: 'DOLOMITI',
      subtitle: 'Italian Alpine Peaks',
      coords: '46.54° N, 11.61° E',
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
      coords: '35.67° N, 139.65° E',
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
      id: 'amsterdam',
      title: 'KEUKENHOF',
      subtitle: 'Tulip Fields in Amsterdam',
      coords: '52.26° N, 4.54° E',
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
      year: '2024',
      orientation: 'landscape'
    },
    {
      id: 2,
      src: 'https://imgur.com/24ww2T8.jpg',
      location: 'Denver',
      year: '2024',
      orientation: 'portrait'
    },
    {
      id: 3,
      src: 'https://imgur.com/MOpItb5.jpg',
      location: 'Lisboa',
      year: '2024',
      orientation: 'landscape'
    },
    {
      id: 4,
      src: 'https://imgur.com/Hdj46ri.jpg',
      location: 'Sevilla',
      year: '2024',
      orientation: 'landscape'
    },
    {
      id: 5,
      src: 'https://imgur.com/NCGqQX6.jpg',
      location: 'Vienna',
      year: '2024',
      orientation: 'landscape'
    },
    {
      id: 6,
      src: 'https://imgur.com/9S6b50E.jpg',
      location: 'Swiss Alps',
      year: '2024',
      orientation: 'portrait'
    }
  ]
};
