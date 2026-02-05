import { Anime, Category } from './types';

export const ALL_GENRES = [
  'Action', 'Adventure', 'Fantasy', 'Sci-Fi', 'Drama', 'Psychological', 
  'Comedy', 'Supernatural', 'Romance', 'Mystery', 'Seinen', 'Shonen', 
  'Slice of Life', 'Sports', 'Thriller', 'Historical', 'Horror', 'Mecha'
];

export const CATEGORIES: string[] = [
  'All',
  Category.MUST_WATCH,
  Category.GOATS,
  Category.PEAK,
  Category.GOOD,
  Category.NOTHING_ELSE,
  Category.SPORTS,
  Category.UNDERRATED,
  Category.UNKNOWN
];

export const ANIME_LIST: Anime[] = [
  // MUST WATCH ANIME
  {
    id: 'mw-1',
    title: 'Cyberpunk Edgerunners',
    category: Category.MUST_WATCH,
    genres: ['Action', 'Sci-Fi', 'Psychological'],
    description: 'In a dystopia riddled with corruption and cybernetic implants, a talented but reckless street kid strives to become a mercenary outlaw.',
    coverImageURL: 'https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p22812509_b_v13_ab.jpg',
    releaseYear: 2022,
    status: 'Finished',
    trailerUrl: 'https://www.youtube.com/watch?v=JtqIas3bYhg'
  },
  {
    id: 'mw-2',
    title: 'Dragon Ball (Z, GT)',
    category: Category.MUST_WATCH,
    genres: ['Action', 'Adventure', 'Fantasy'],
    description: 'The legendary adventures of Goku as he defends the Earth against powerful galactic threats and explores his heritage.',
    coverImageURL: 'https://a.storyblok.com/f/178900/640x960/da03dda68a/cbdf29cd77e0512cbbdd77e77c5530061647360873_main.jpg/m/filters:quality(95)format(webp)',
    releaseYear: 1989,
    status: 'Finished',
    trailerUrl: 'https://www.youtube.com/watch?v=hGInm97FwYc'
  },
  {
    id: 'mw-3',
    title: 'Bleach',
    category: Category.MUST_WATCH,
    genres: ['Action', 'Supernatural', 'Fantasy'],
    description: 'Ichigo Kurosaki becomes a Soul Reaper to protect his town from restless spirits known as Hollows.',
    coverImageURL: 'https://i.pinimg.com/736x/8b/3e/9c/8b3e9c7953d6cdc568b288bdf25b4f10.jpg',
    releaseYear: 2004,
    status: 'Finished',
    trailerUrl: 'https://www.youtube.com/watch?v=e8_A7C20u_4'
  },
  {
    id: 'mw-4',
    title: 'JoJo’s Bizarre Adventure',
    category: Category.MUST_WATCH,
    genres: ['Action', 'Adventure', 'Supernatural'],
    description: 'The intergenerational struggle of the Joestar family against supernatural forces and ancient enemies.',
    coverImageURL: 'https://m.media-amazon.com/images/I/81c2xcL065L._AC_UF894,1000_QL80_.jpg',
    releaseYear: 2012,
    status: 'Ongoing',
    trailerUrl: 'https://www.youtube.com/watch?v=TiG6Y20B6k0'
  },
  {
    id: 'mw-5',
    title: 'My Hero Academia',
    category: Category.MUST_WATCH,
    genres: ['Action', 'Comedy', 'Shonen'],
    description: 'In a world of heroes, Izuku Midoriya pursues his dream of becoming the greatest hero despite starting without a quirk.',
    coverImageURL: 'https://external-preview.redd.it/my-hero-academia-season-7-key-visual-v0-h_11UwfFpZN5y-E5dgFYdEbbat8p660xdmNHJpRHomg.jpg?width=640&crop=smart&auto=webp&s=a241f94cfe4f51b4f5a5d1718998422b73738674',
    releaseYear: 2016,
    status: 'Ongoing',
    trailerUrl: 'https://www.youtube.com/watch?v=EPV_P3P-f60'
  },
  {
    id: 'mw-6',
    title: 'Black Clover',
    category: Category.MUST_WATCH,
    genres: ['Action', 'Fantasy', 'Comedy'],
    description: 'Asta and Yuno, two orphans with contrasting magical abilities, compete to become the Wizard King.',
    coverImageURL: 'https://m.media-amazon.com/images/I/81uEVxA2VPS._AC_UF894,1000_QL80_.jpg',
    releaseYear: 2017,
    status: 'Finished',
    trailerUrl: 'https://www.youtube.com/watch?v=vUunPz5-vP4'
  },
  {
    id: 'mw-7',
    title: 'Hunter x Hunter',
    category: Category.MUST_WATCH,
    genres: ['Action', 'Adventure', 'Fantasy'],
    description: 'Gon Freecss embarks on a journey to become a Hunter and find his mysterious father.',
    coverImageURL: 'https://images-cdn.ubuy.co.in/694632b496cd3b62d6037729-poster-stop-online-hunter-x-hunter.jpg',
    releaseYear: 2011,
    status: 'Finished',
    trailerUrl: 'https://www.youtube.com/watch?v=d6kBeJjTGnY'
  },
  {
    id: 'mw-8',
    title: 'Vinland Saga',
    category: Category.MUST_WATCH,
    genres: ['Action', 'Adventure', 'Historical'],
    description: 'A Viking epic centered on revenge, war, and the search for a land without conflict.',
    coverImageURL: 'https://static.wikia.nocookie.net/vinlandsaga/images/7/7b/Vinland_Saga_S2_Key_Visual_2.png/revision/latest?cb=20220608122056',
    releaseYear: 2019,
    status: 'Ongoing',
    trailerUrl: 'https://www.youtube.com/watch?v=f8Tf89A96U0'
  },
  {
    id: 'mw-9',
    title: 'InuYasha',
    category: Category.MUST_WATCH,
    genres: ['Adventure', 'Fantasy', 'Romance'],
    description: 'Kagome is pulled into feudal Japan where she joins forces with half-demon Inuyasha to find the Shikon Jewel shards.',
    coverImageURL: 'https://m.media-amazon.com/images/M/MV5BYWQ0M2I5YjgtYWVjNC00ZmE1LWEyMjUtY2U4MmJjNjk2Njk3XkEyXkFqcGc@._V1_.jpg',
    releaseYear: 2000,
    status: 'Finished'
  },

  // GOATS OF ANIME
  {
    id: 'goat-1',
    title: 'Dragon Ball Super',
    category: Category.GOATS,
    genres: ['Action', 'Adventure', 'Fantasy'],
    description: 'The saga continues as Goku reaches new heights of power to face gods and multiversal tournaments.',
    coverImageURL: 'https://m.media-amazon.com/images/I/919bXnjsZgL._UF1000,1000_QL80_.jpg',
    releaseYear: 2015,
    status: 'Finished',
    trailerUrl: 'https://www.youtube.com/watch?v=tIit6mD6-fI'
  },
  {
    id: 'goat-2',
    title: 'Demon Slayer',
    category: Category.GOATS,
    genres: ['Action', 'Supernatural', 'Historical'],
    description: 'Tanjiro Kamado sets out to cure his sister and avenge his family after a devastating demon attack.',
    coverImageURL: 'https://preview.redd.it/demon-slayer-kimetsu-no-yaiba-infinity-castle-arc-part-1-v0-l7fjxyu912me1.jpeg?width=640&crop=smart&auto=webp&s=579f508dd3449ee311347b2f0fe832c2f85b82be',
    releaseYear: 2019,
    status: 'Ongoing',
    trailerUrl: 'https://www.youtube.com/watch?v=VQGCKyvzIM4'
  },
  {
    id: 'goat-3',
    title: 'Solo Leveling',
    category: Category.GOATS,
    genres: ['Action', 'Fantasy', 'Adventure'],
    description: 'The weakest hunter in the world gains the ability to level up infinitely in a modern world plagued by dungeons.',
    coverImageURL: 'https://static.wikia.nocookie.net/solo-leveling/images/3/3d/Solo_Leveling_%28First_Poster_Anime%29.jpg/revision/latest?cb=20240920105533',
    releaseYear: 2024,
    status: 'Ongoing',
    trailerUrl: 'https://www.youtube.com/watch?v=V6P6v689Poc'
  },
  {
    id: 'goat-4',
    title: 'Jujutsu Kaisen',
    category: Category.GOATS,
    genres: ['Action', 'Supernatural', 'Drama'],
    description: 'Yuji Itadori enters the dangerous world of Sorcerers after consuming a powerful cursed artifact.',
    coverImageURL: 'https://i.pinimg.com/originals/23/4c/72/234c72a6fdb8a993cd9f68deaf9bd661.jpg',
    releaseYear: 2020,
    status: 'Ongoing',
    trailerUrl: 'https://www.youtube.com/watch?v=pkKu7TV_OAU'
  },
  {
    id: 'goat-5',
    title: 'Gachiakuta',
    category: Category.GOATS,
    genres: ['Action', 'Fantasy', 'Drama'],
    description: 'After being cast into the abyss of trash, Rudo must fight for survival in a vibrant and dangerous wasteland.',
    coverImageURL: 'https://static.wikia.nocookie.net/gachiakuta/images/8/88/Anime_Main_Visual_2.png/revision/latest?cb=20250606050608',
    releaseYear: 2025,
    status: 'Ongoing'
  },
  {
    id: 'goat-6',
    title: 'Charlotte',
    category: Category.GOATS,
    genres: ['Supernatural', 'Drama', 'School'],
    description: 'Teenagers with imperfect superpowers navigate the challenges of their abilities and hidden conspiracies.',
    coverImageURL: 'https://i.pinimg.com/564x/0b/6f/0c/0b6f0c0d98b1e3c6db79dd50675c94ca.jpg',
    releaseYear: 2015,
    status: 'Finished'
  },
  {
    id: 'goat-7',
    title: 'Death Note',
    category: Category.GOATS,
    genres: ['Psychological', 'Thriller', 'Supernatural'],
    description: 'A high school prodigy attempts to rid the world of criminals using a supernatural notebook that can kill.',
    coverImageURL: 'https://m.media-amazon.com/images/I/71GqUgwo-eL._AC_UF894,1000_QL80_.jpg',
    releaseYear: 2006,
    status: 'Finished',
    trailerUrl: 'https://www.youtube.com/watch?v=NlJZ-YgAt-c'
  },

  // PEAK OF ANIME
  {
    id: 'peak-1',
    title: 'Dr. Stone',
    category: Category.PEAK,
    genres: ['Sci-Fi', 'Adventure', 'Comedy'],
    description: 'Thousands of years after humanity is petrified, Senku Ishigami uses science to rebuild civilization from scratch.',
    coverImageURL: 'https://static.wikia.nocookie.net/dr-stone/images/c/cb/Anime_date_announcement.png/revision/latest?cb=20190110034129',
    releaseYear: 2019,
    status: 'Ongoing',
    trailerUrl: 'https://www.youtube.com/watch?v=7v_pS6G_q2Y'
  },
  {
    id: 'peak-2',
    title: 'The Apothecary Diaries',
    category: Category.PEAK,
    genres: ['Mystery', 'Historical', 'Drama'],
    description: 'A young apothecary solves medical mysteries within the imperial palace using her wit and knowledge of poisons.',
    coverImageURL: 'https://m.media-amazon.com/images/M/MV5BOGU5MGI2MzEtMWU2Ni00ZWY2LWI5Y2UtMzI5N2Q2YTYxNTFkXkEyXkFqcGc@._V1_.jpg',
    releaseYear: 2023,
    status: 'Ongoing',
    trailerUrl: 'https://www.youtube.com/watch?v=0kH85mX-TIE'
  },
  {
    id: 'peak-3',
    title: 'Re:ZERO',
    category: Category.PEAK,
    genres: ['Drama', 'Fantasy', 'Psychological'],
    description: 'Subaru Natsuki is transported to a fantasy world where he discovers he has the power to return from death.',
    coverImageURL: 'https://i.redd.it/v3vakalzmtpa1.jpg',
    releaseYear: 2016,
    status: 'Ongoing',
    trailerUrl: 'https://www.youtube.com/watch?v=vFfXjuVA1Jk'
  },
  {
    id: 'peak-4',
    title: 'Frieren: Beyond Journey’s End',
    category: Category.PEAK,
    genres: ['Adventure', 'Fantasy', 'Drama'],
    description: 'An immortal elf reflects on the passage of time and the lives of her human companions after their great quest.',
    coverImageURL: 'https://static.wikia.nocookie.net/frieren/images/8/80/Season_1_key_visual_3.png/revision/latest/scale-to-width-down/1200?cb=20230719173128',
    releaseYear: 2023,
    status: 'Ongoing',
    trailerUrl: 'https://www.youtube.com/watch?v=q6D_76z24jM'
  },
  {
    id: 'peak-5',
    title: 'Hell’s Paradise',
    category: Category.PEAK,
    genres: ['Action', 'Adventure', 'Supernatural'],
    description: 'Convicts are sent to a mysterious island to find the elixir of life in exchange for a full pardon.',
    coverImageURL: 'https://m.media-amazon.com/images/I/81keV50g-yL._AC_UF1000,1000_QL80_.jpg',
    releaseYear: 2023,
    status: 'Ongoing',
    trailerUrl: 'https://www.youtube.com/watch?v=X2m_I8656vI'
  },
  {
    id: 'peak-6',
    title: 'Lord of Mysteries',
    category: Category.PEAK,
    genres: ['Mystery', 'Supernatural', 'Fantasy'],
    description: 'In a Victorian-inspired world of beyonders and secret organizations, Klein Moretti unravels cosmic secrets.',
    coverImageURL: 'https://i.pinimg.com/736x/e8/dd/65/e8dd65c55ad976cc159c56b9b15a62b3.jpg',
    releaseYear: 2025,
    status: 'Ongoing'
  },
  {
    id: 'peak-7',
    title: 'Darling in the Franxx',
    category: Category.PEAK,
    genres: ['Sci-Fi', 'Mecha', 'Romance'],
    description: 'In a post-apocalyptic future, young pilots must synchronize to control giant robots and defend humanity.',
    coverImageURL: 'https://m.media-amazon.com/images/M/MV5BYWNlYzk1NGQtNTZkNi00YzJiLWJkMWUtZTYzNjI3YTc5ZDRhXkEyXkFqcGc@._V1_.jpg',
    releaseYear: 2018,
    status: 'Finished',
    trailerUrl: 'https://www.youtube.com/watch?v=2N9p5NfB514'
  },
  {
    id: 'peak-8',
    title: 'Classroom of the Elite',
    category: Category.PEAK,
    genres: ['Drama', 'Psychological', 'School'],
    description: 'Students in a prestigious, high-stakes school engage in mental warfare to climb the ranks of their hierarchy.',
    coverImageURL: 'https://m.media-amazon.com/images/M/MV5BY2U2NWU5MzMtOGY5Ni00MGI5LWFkZDYtMGNlN2RhMGRhNGZkXkEyXkFqcGc@._V1_.jpg',
    releaseYear: 2017,
    status: 'Ongoing',
    trailerUrl: 'https://www.youtube.com/watch?v=kY6T-7pT3Ww'
  },
  {
    id: 'peak-9',
    title: 'Shangri-La Frontier',
    category: Category.PEAK,
    genres: ['Action', 'Adventure', 'Comedy'],
    description: 'A "trash-tier" game expert takes on a legendary god-tier VRMMO and shakes its foundation with his skills.',
    coverImageURL: 'https://external-preview.redd.it/shangri-la-frontier-season-2-new-visual-v0-lxDvU10hyDv15oNseLR_oa2ZtDwlpVyS3vmQ8ufbg2c.jpg?auto=webp&s=804651a372248468334f40a58af563768fd68b26',
    releaseYear: 2023,
    status: 'Ongoing',
    trailerUrl: 'https://www.youtube.com/watch?v=H7uS0i0X88Y'
  },

  // GOOD ANIME
  {
    id: 'good-1',
    title: 'Zom 100: Bucket List of the Dead',
    category: Category.GOOD,
    genres: ['Action', 'Comedy', 'Supernatural'],
    description: 'A burnt-out employee finds new life during a zombie apocalypse and decides to live his life to the fullest.',
    coverImageURL: 'https://static.wikia.nocookie.net/zombie-100/images/9/9e/Anime_Key_Visual_1.jpg/revision/latest?cb=20230624103603',
    releaseYear: 2023,
    status: 'Finished',
    trailerUrl: 'https://www.youtube.com/watch?v=7hXz60Tz-0U'
  },
  {
    id: 'good-2',
    title: 'My Happy Marriage',
    category: Category.GOOD,
    genres: ['Romance', 'Fantasy', 'Historical'],
    description: 'An unloved daughter finds hope and healing in an arranged marriage to a supposedly cold military officer.',
    coverImageURL: 'https://m.media-amazon.com/images/M/MV5BYzFkNDE4MmYtYTI4ZS00NTM1LWJlMTEtNWE2ZGNiZTE5YTVjXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
    releaseYear: 2023,
    status: 'Ongoing',
    trailerUrl: 'https://www.youtube.com/watch?v=3W1_1T9vYwU'
  },
  {
    id: 'good-3',
    title: 'The Devil Is a Part-Timer!',
    category: Category.GOOD,
    genres: ['Comedy', 'Fantasy', 'Supernatural'],
    description: 'The Demon King is transported to modern Tokyo and forced to work at a fast-food restaurant to survive.',
    coverImageURL: 'https://m.media-amazon.com/images/M/MV5BODdjMWIyYjQtNzI4ZC00ZjA1LWJmYzMtYTA1ZjFiNTMxZWI5XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
    releaseYear: 2013,
    status: 'Finished'
  },
  {
    id: 'good-4',
    title: 'Mob Psycho 100',
    category: Category.GOOD,
    genres: ['Action', 'Comedy', 'Supernatural'],
    description: 'A powerful esper boy tries to live a normal life while suppressing his explosive psychic emotions.',
    coverImageURL: 'https://a.storyblok.com/f/178900/640x910/100590e9ce/4b84b65fecda379fedb477bf368150f21521377449_full.jpg/m/640x910',
    releaseYear: 2016,
    status: 'Finished',
    trailerUrl: 'https://www.youtube.com/watch?v=nTese7u09V8'
  },
  {
    id: 'good-5',
    title: 'Golden Time',
    category: Category.GOOD,
    genres: ['Romance', 'Drama', 'Comedy'],
    description: 'A college student with amnesia navigates new relationships and the shadows of his past self.',
    coverImageURL: 'https://preview.redd.it/golden-time-v0-jud6v5ze8i8g1.jpeg?auto=webp&s=e89df0084092489a05886a8d56192e7417061634',
    releaseYear: 2013,
    status: 'Finished'
  },
  {
    id: 'good-6',
    title: 'Undead Unluck',
    category: Category.GOOD,
    genres: ['Action', 'Comedy', 'Supernatural'],
    description: 'A girl with bad luck and a man who cannot die team up to challenge the rules of the universe.',
    coverImageURL: 'https://m.media-amazon.com/images/M/MV5BNzFkODQxNDItMTZiMC00NjhkLWFkNjEtZDQ4MGQ0MmNhZmUzXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
    releaseYear: 2023,
    status: 'Finished',
    trailerUrl: 'https://www.youtube.com/watch?v=FstYh1fX1b4'
  },
  {
    id: 'good-7',
    title: 'Mushoku Tensei',
    category: Category.GOOD,
    genres: ['Adventure', 'Fantasy', 'Drama'],
    description: 'A failed man is reincarnated into a magical world and vows to live his life without regrets.',
    coverImageURL: 'https://comicbook.com/wp-content/uploads/sites/4/2024/05/c94a9598-0003-4b4a-a80c-4716c19d3d46.jpg?w=1024',
    releaseYear: 2021,
    status: 'Ongoing',
    trailerUrl: 'https://www.youtube.com/watch?v=680XjU5jX_Q'
  },
  {
    id: 'good-8',
    title: 'Goblin Slayer',
    category: Category.GOOD,
    genres: ['Action', 'Fantasy', 'Adventure'],
    description: 'A grim warrior dedicates his life to exterminating every goblin in existence with ruthless efficiency.',
    coverImageURL: 'https://m.media-amazon.com/images/M/MV5BMTk1MGM5ZDQtMWFkZS00YTUyLWIzYWYtZTQwYWYzNzQ3MTMyXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
    releaseYear: 2018,
    status: 'Ongoing',
    trailerUrl: 'https://www.youtube.com/watch?v=FstYh1fX1b4'
  },
  {
    id: 'good-9',
    title: 'Sentenced to Be a Hero',
    category: Category.GOOD,
    genres: ['Action', 'Fantasy', 'Drama'],
    description: 'A former criminal is forced into the role of a hero as a punishment for his past deeds.',
    coverImageURL: 'https://a.storyblok.com/f/178900/849x1200/4268ea28b9/sentenced-to-be-a-hero-visual.jpeg/m/filters:quality(95)format(webp)',
    releaseYear: 2025,
    status: 'Ongoing'
  },

  // ANIME TO WATCH WHEN THERE’S NOTHING ELSE
  {
    id: 'ne-1',
    title: 'Wind Breaker',
    category: Category.NOTHING_ELSE,
    genres: ['Action', 'Drama', 'School'],
    description: 'A delinquent student joins a neighborhood defense group and learns the value of protecting others.',
    coverImageURL: 'https://m.media-amazon.com/images/M/MV5BNTQzNDI5OGItZDZkMy00MWQ1LWIwM2YtYzc2YWNhOGJlZWQxXkEyXkFqcGc@._V1_.jpg',
    releaseYear: 2024,
    status: 'Ongoing',
    trailerUrl: 'https://www.youtube.com/watch?v=FstYh1fX1b4'
  },
  {
    id: 'ne-2',
    title: 'Kaiju No. 8',
    category: Category.NOTHING_ELSE,
    genres: ['Action', 'Sci-Fi', 'Horror'],
    description: 'A man working in kaiju cleanup gains the power to transform into a monster himself.',
    coverImageURL: 'https://a.storyblok.com/f/178900/750x1060/21be9c9b68/kaiju_no_8_exhibition_key_visual.jpg/m/filters:quality(95)format(webp)',
    releaseYear: 2024,
    status: 'Ongoing',
    trailerUrl: 'https://www.youtube.com/watch?v=7nS_a2L9W_Y'
  },
  {
    id: 'ne-3',
    title: 'To Be Hero X',
    category: Category.NOTHING_ELSE,
    genres: ['Action', 'Comedy', 'Sci-Fi'],
    description: 'A world where heroes are ranked by their strength and public image faces a new, mysterious threat.',
    coverImageURL: 'https://m.media-amazon.com/images/M/MV5BOTM3ZTgyZDUtM2FhNi00N2E1LWJlYzEtZGVhNDc3ZDEwODM2XkEyXkFqcGc@._V1_.jpg',
    releaseYear: 2025,
    status: 'Ongoing'
  },
  {
    id: 'ne-4',
    title: 'Danganronpa',
    category: Category.NOTHING_ELSE,
    genres: ['Mystery', 'Horror', 'Psychological'],
    description: 'Students at a prestigious academy are forced into a deadly killing game by a sadistic bear.',
    coverImageURL: 'https://m.media-amazon.com/images/I/810bte0sz0L.jpg',
    releaseYear: 2013,
    status: 'Finished',
    trailerUrl: 'https://www.youtube.com/watch?v=f-B6yXWp4qU'
  },
  {
    id: 'ne-5',
    title: 'More Than a Married Couple, But Not Lovers',
    category: Category.NOTHING_ELSE,
    genres: ['Romance', 'Comedy', 'School'],
    description: 'High school students are paired up for a mandatory marriage training program.',
    coverImageURL: 'https://a.storyblok.com/f/178900/720x1019/92a2df354f/f8bb861fa9fb82fb3d5f8887c36668231651454540_main.jpg/m/filters:quality(95)format(webp)',
    releaseYear: 2022,
    status: 'Finished'
  },
  {
    id: 'ne-6',
    title: 'Shikimori’s Not Just a Cutie',
    category: Category.NOTHING_ELSE,
    genres: ['Romance', 'Comedy', 'Slice of Life'],
    description: 'The cool and protective side of Shikimori comes out whenever her unlucky boyfriend is in trouble.',
    coverImageURL: 'https://m.media-amazon.com/images/I/81DSFQq38lL._AC_UF1000,1000_QL80_.jpg',
    releaseYear: 2022,
    status: 'Finished'
  },
  {
    id: 'ne-7',
    title: 'Mashle: Magic and Muscles',
    category: Category.NOTHING_ELSE,
    genres: ['Action', 'Comedy', 'Fantasy'],
    description: 'In a world of magic, a boy without a lick of it must use his raw physical strength to succeed at a magic academy.',
    coverImageURL: 'https://image.tmdb.org/t/p/original/yORTvQOQTZzZ9JRIpRH4QaIaQBm.jpg',
    releaseYear: 2023,
    status: 'Finished',
    trailerUrl: 'https://www.youtube.com/watch?v=FstYh1fX1b4'
  },
  {
    id: 'ne-8',
    title: 'Dead Mount Death Play',
    category: Category.NOTHING_ELSE,
    genres: ['Action', 'Fantasy', 'Supernatural'],
    description: 'A powerful necromancer from another world is reincarnated as a child in modern Shinjuku.',
    coverImageURL: 'https://m.media-amazon.com/images/M/MV5BNGYzNDFmMjgtZjFlMi00Yzg5LTkxMmEtOGY0N2FjNGNjZjA1XkEyXkFqcGc@._V1_.jpg',
    releaseYear: 2023,
    status: 'Finished'
  },
  {
    id: 'ne-9',
    title: 'Unnamed Memory',
    category: Category.NOTHING_ELSE,
    genres: ['Fantasy', 'Romance', 'Adventure'],
    description: 'A cursed prince seeks out a powerful witch to break his spell, starting a journey of discovery and destiny.',
    coverImageURL: 'https://m.media-amazon.com/images/M/MV5BY2Q5NTRiYTgtZjJmOS00YjQ0LWE2MmQtMjE5MmM3ODQ5ZDg2XkEyXkFqcGc@._V1_.jpg',
    releaseYear: 2024,
    status: 'Ongoing'
  },

  // SPORTS ANIME
  {
    id: 'sp-1',
    title: 'Kuroko no Basket',
    category: Category.SPORTS,
    genres: ['Sports', 'Action', 'Comedy'],
    description: 'A basketball team attempts to reach the top of the high school leagues by defeating the legendary "Generation of Miracles."',
    coverImageURL: 'https://images-cdn.ubuy.co.in/635229bf8675fc7d07430182-kuroko-no-basket-tetsuya-kuroko-kagami.jpg',
    releaseYear: 2012,
    status: 'Finished',
    trailerUrl: 'https://www.youtube.com/watch?v=TiG6Y20B6k0'
  },
  {
    id: 'sp-2',
    title: 'Haikyuu!!',
    category: Category.SPORTS,
    genres: ['Sports', 'Drama', 'Comedy'],
    description: 'A high school volleyball team fights for their place in the national tournament with heart and determination.',
    coverImageURL: 'https://m.media-amazon.com/images/I/71ugKSErpsS._AC_UF894,1000_QL80_.jpg',
    releaseYear: 2014,
    status: 'Finished',
    trailerUrl: 'https://www.youtube.com/watch?v=J_pnu8v9Lyo'
  },
  {
    id: 'sp-3',
    title: 'Hajime no Ippo',
    category: Category.SPORTS,
    genres: ['Sports', 'Action', 'Drama'],
    description: 'A bullied boy discovers his hidden talent for boxing and works his way up the professional rankings.',
    coverImageURL: 'https://m.media-amazon.com/images/M/MV5BN2UzMmM5NTQtYjUxYy00OWVjLTkwOWMtYzFhOGQxN2VlZjI5XkEyXkFqcGc@._V1_.jpg',
    releaseYear: 2000,
    status: 'Finished',
    trailerUrl: 'https://www.youtube.com/watch?v=TiG6Y20B6k0'
  },

  // UNDERRATED ANIME
  {
    id: 'ur-1',
    title: 'Seraph of the End',
    category: Category.UNDERRATED,
    genres: ['Action', 'Drama', 'Supernatural'],
    description: 'Humanity struggles to survive in a world ruled by vampires after a mysterious apocalyptic virus.',
    coverImageURL: 'https://m.media-amazon.com/images/M/MV5BNTllMDkyNGEtNzIzMi00ZmUyLTlhNjUtYzRmN2NhYzZmOTBmXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
    releaseYear: 2015,
    status: 'Finished'
  },
  {
    id: 'ur-2',
    title: 'Great Pretender',
    category: Category.UNDERRATED,
    genres: ['Action', 'Adventure', 'Mystery'],
    description: 'A small-time con artist gets swept up in a global operation of high-stakes deception and elaborate schemes.',
    coverImageURL: 'https://static.wikia.nocookie.net/greatpretender/images/a/a8/Great_Pretender_-_First_key_visual.jpg/revision/latest?cb=20200129014822',
    releaseYear: 2020,
    status: 'Finished'
  },

  // MORE UNKNOWN ANIME
  {
    id: 'uk-1',
    title: 'Talentless Nana',
    category: Category.UNKNOWN,
    genres: ['Psychological', 'Thriller', 'Supernatural'],
    description: 'On a secret island school for gifted children, a student without powers begins a deadly game of elimination.',
    coverImageURL: 'https://m.media-amazon.com/images/M/MV5BYmUwNTUyYWMtY2U2Yy00Y2Y1LWFmZmMtZTNlNmU3NmY3N2FhXkEyXkFqcGc@._V1_.jpg',
    releaseYear: 2020,
    status: 'Finished'
  },
  {
    id: 'uk-2',
    title: 'Elfen Lied',
    category: Category.UNKNOWN,
    genres: ['Action', 'Drama', 'Horror'],
    description: 'A mutant girl with invisible arms escapes a research facility, leaving a trail of destruction in her wake.',
    coverImageURL: 'https://resizing.flixster.com/jnM2V6pg3Tq1wtlj_oXtTi5KFvA=/fit-in/705x460/v2/https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p231009_b_v8_aa.jpg',
    releaseYear: 2004,
    status: 'Finished'
  },
  {
    id: 'uk-3',
    title: 'UQ Holder',
    category: Category.UNKNOWN,
    genres: ['Action', 'Fantasy', 'Sci-Fi'],
    description: 'A young immortal joins an organization of fellow immortals to explore their magical world.',
    coverImageURL: 'https://m.media-amazon.com/images/I/61U1BgN4hmL.jpg',
    releaseYear: 2017,
    status: 'Finished'
  },
  {
    id: 'uk-4',
    title: 'Air Gear',
    category: Category.UNKNOWN,
    genres: ['Action', 'Sports', 'Comedy'],
    description: 'Street gangs compete for territory using high-tech motorized rollerblades known as Air Treks.',
    coverImageURL: 'https://m.media-amazon.com/images/M/MV5BMjg4NDc4NjctOTg0ZC00NDU0LWE3ZmQtNTQ2NWQ2MzMyYjZmXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
    releaseYear: 2006,
    status: 'Finished'
  },
  {
    id: 'uk-5',
    title: 'Darwin’s Game',
    category: Category.UNKNOWN,
    genres: ['Action', 'Sci-Fi', 'Mystery'],
    description: 'A high school student gets trapped in a deadly real-life mobile game survival contest.',
    coverImageURL: 'https://m.media-amazon.com/images/M/MV5BNDRmMGI4NjYtYjFkYi00NTBlLWI0YmEtMThmMjU2ZDI2MWNkXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
    releaseYear: 2020,
    status: 'Finished'
  },
  {
    id: 'uk-6',
    title: 'Edens Zero',
    category: Category.UNKNOWN,
    genres: ['Action', 'Sci-Fi', 'Adventure'],
    description: 'A boy raised by robots embarks on a space-faring quest to find the fabled cosmic goddess, Mother.',
    coverImageURL: 'https://m.media-amazon.com/images/M/MV5BMjhlYWVlN2ItZDg3Yy00NGYxLWJkODYtMjFjZTE1YzVlYjdjXkEyXkFqcGc@._V1_.jpg',
    releaseYear: 2021,
    status: 'Finished'
  },
  {
    id: 'uk-7',
    title: 'The Kingdom of Ruin',
    category: Category.UNKNOWN,
    genres: ['Action', 'Fantasy', 'Drama'],
    description: 'A survivor of a witch hunt seeks bloody revenge against the advanced scientific empire that killed his master.',
    coverImageURL: 'https://m.media-amazon.com/images/M/MV5BY2M4MjE2ZmEtM2M2MC00NjU2LWI0Y2EtNzRkNGVkNmM5MDBjXkEyXkFqcGc@._V1_.jpg',
    releaseYear: 2023,
    status: 'Finished'
  },
  {
    id: 'uk-8',
    title: 'Gods’ Games We Play',
    category: Category.UNKNOWN,
    genres: ['Sci-Fi', 'Fantasy', 'Strategy'],
    description: 'Bored gods challenge humans to a series of ultimate games with the fate of their world on the line.',
    coverImageURL: 'https://m.media-amazon.com/images/M/MV5BNjc4NGQxY2ItZTE2NC00M2U4LTk4OTUtZTcxNjVlMDVjZDk0XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
    releaseYear: 2024,
    status: 'Ongoing'
  },
  {
    id: 'uk-9',
    title: 'The Ossan Newbie Adventurer, Trained to Death by the Most Powerful Party, Became Invincible',
    category: Category.UNKNOWN,
    genres: ['Action', 'Adventure', 'Fantasy'],
    description: 'A 30-year-old adventurer with late-blooming talent uses his brutal training to shock the world.',
    coverImageURL: 'https://m.media-amazon.com/images/M/MV5BMzczOTc3NTctMGUyOS00ZDgxLTlkMWItNTRhNWY3NzcxNmJkXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
    releaseYear: 2024,
    status: 'Ongoing'
  },
  {
    id: 'uk-10',
    title: 'Serial Experiments Lain',
    category: Category.UNKNOWN,
    genres: ['Psychological', 'Sci-Fi', 'Mystery'],
    description: 'A girl becomes increasingly connected to a vast network, questioning the boundaries between reality and digital life.',
    coverImageURL: 'https://m.media-amazon.com/images/M/MV5BZGJiMmEyMDMtMTJlZi00YTgwLWI1ODgtZDA1YjEyM2Q5MjI3XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
    releaseYear: 1998,
    status: 'Finished'
  },
  {
    id: 'uk-11',
    title: 'Sword of the Demon Hunter: Kijin Gentōshō',
    category: Category.UNKNOWN,
    genres: ['Action', 'Fantasy', 'Historical'],
    description: 'An intergenerational story of a warrior hunting demons across different eras of Japanese history.',
    coverImageURL: 'https://upload.wikimedia.org/wikipedia/en/1/1c/Kijin_Gent%C5%8Dsh%C5%8D_novel_volume_1_cover.jpg',
    releaseYear: 2024,
    status: 'Ongoing'
  },
  {
    id: 'uk-12',
    title: 'Terror in Tokyo',
    category: Category.UNKNOWN,
    genres: ['Thriller', 'Psychological', 'Mystery'],
    description: 'Two mysterious teenagers conduct a series of tactical bombings in Tokyo to deliver a cryptic message to the world.',
    coverImageURL: 'https://m.media-amazon.com/images/I/61PUDYpfFlL.jpg',
    releaseYear: 2014,
    status: 'Finished'
  }
];