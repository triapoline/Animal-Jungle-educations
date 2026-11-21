import { SpeciesData } from '../types/game';

export const SPECIES_DATA: SpeciesData[] = [
  // =========================================================================
  // EASY — Primary 3–4 Foundation (Diversity & Life Cycles)
  // =========================================================================
  {
    id: 'common-rose-butterfly',
    difficulty: 'easy',
    name: { en: 'Common Rose Butterfly', id: 'Kupu-kupu Mawar Biasa' },
    scientificName: 'Pachliopta aristolochiae',
    group: 'Insects',
    groupLabel: { en: 'Insect', id: 'Serangga' },
    syllabusFocus: {
      en: 'P3 Diversity & P4 4-Stage Life Cycle',
      id: 'P3 Keanekaragaman & P4 Siklus Hidup 4 Tahap',
    },
    habitat: {
      en: 'Sunlit Forest Clearing · Flowering Ginger',
      id: 'Area Terbuka Hutan · Bunga Jahe Liar',
    },
    summary: {
      en: 'A velvet-black swallowtail butterfly with bright crimson markings that pollinates forest flowers.',
      id: 'Kupu-kupu ekor layang hitam beludru bercorak merah terang yang membantu penyerbukan bunga hutan.',
    },
    spawnXZ: [3.2, -5.8],
    perchHeight: 1.05,
    worldScale: 1.15,
    inspectDistance: 1.9,
    inspectTargetY: 0.1,
    initialYaw: -0.5,
    perchType: 'flower',
    hotspots: [
      {
        id: 'antennae',
        label: { en: 'Clubbed Antennae', id: 'Antena Berujung Gada' },
        conceptTag: { en: 'Insect Feature · Sense Organ', id: 'Ciri Serangga · Alat Indra' },
        explanation: {
          en: 'All insects have a pair of feelers (antennae) on their head. Butterflies use their club-tipped antennae to smell nectar and sense wind direction while flying.',
          id: 'Semua serangga memiliki sepasang antena di kepalanya. Kupu-kupu menggunakan antena berujung gada untuk mencium nektar dan merasakan arah angin saat terbang.',
        },
        anchor: [0, 0.2, 0.44],
      },
      {
        id: 'wings',
        label: { en: 'Crimson-Spotted Wings', id: 'Sayap Bercorak Merah' },
        conceptTag: { en: 'Warning Colours · Flight', id: 'Warna Peringatan · Terbang' },
        explanation: {
          en: 'Covered in microscopic overlapping scales, the bright red hindwing spots warn birds that this butterfly tastes unpleasant from toxins absorbed as a caterpillar.',
          id: 'Tertutup sisik mikroskopis, bintik merah cerah di sayap belakang memperingatkan burung bahwa kupu-kupu ini berasa tidak enak karena racun yang diserap saat menjadi ulat.',
        },
        anchor: [0.46, 0.18, -0.05],
      },
      {
        id: 'legs',
        label: { en: '6 Jointed Legs & 3 Body Parts', id: '6 Kaki Beruas & 3 Bagian Tubuh' },
        conceptTag: { en: 'MOE Insect Classification', id: 'Klasifikasi Serangga MOE' },
        explanation: {
          en: 'Like every insect in the MOE Diversity syllabus, it has three body parts (head, thorax, abdomen), a hard outer covering (exoskeleton), and six jointed legs attached to the thorax.',
          id: 'Seperti setiap serangga dalam silabus MOE, tubuhnya terdiri dari tiga bagian (kepala, dada, perut), rangka luar keras (eksoskeleton), dan enam kaki beruas yang menempel pada dada.',
        },
        anchor: [-0.14, -0.14, 0.08],
      },
      {
        id: 'lifecycle',
        label: { en: '4-Stage Life Cycle', id: 'Siklus Hidup 4 Tahap' },
        conceptTag: { en: 'Complete Metamorphosis', id: 'Metamorfosis Sempurna' },
        explanation: {
          en: 'Butterflies undergo a 4-stage life cycle: Egg → Larva (caterpillar, eats leaves rapidly and moults) → Pupa (chrysalis, does not eat while transforming) → Adult.',
          id: 'Kupu-kupu mengalami siklus hidup 4 tahap: Telur → Larva (ulat, makan daun dengan cepat dan berganti kulit) → Pupa (kepompong, tidak makan saat berubah bentuk) → Dewasa.',
        },
        anchor: [0, 0.02, -0.34],
      },
    ],
    quiz: {
      question: {
        en: 'Which stage in the Common Rose Butterfly’s life cycle feeds voraciously on leaves and moults several times as it grows?',
        id: 'Tahap manakah dalam siklus hidup Kupu-kupu Mawar yang makan daun dengan rakus dan berganti kulit beberapa kali saat tumbuh?',
      },
      options: [
        { en: 'Egg stage', id: 'Tahap telur' },
        { en: 'Larva (caterpillar) stage', id: 'Tahap larva (ulat)' },
        { en: 'Pupa (chrysalis) stage', id: 'Tahap pupa (kepompong)' },
        { en: 'Adult stage', id: 'Tahap dewasa' },
      ],
      correctIndex: 1,
      explanation: {
        en: 'In a 4-stage insect life cycle, the larva (caterpillar) is the primary feeding and growing stage. The pupa does not feed while reorganising into an adult.',
        id: 'Dalam siklus hidup serangga 4 tahap, larva (ulat) adalah tahap makan dan tumbuh utama. Pupa tidak makan selama proses perubahan menjadi dewasa.',
      },
      points: 50,
    },
  },

  {
    id: 'field-grasshopper',
    difficulty: 'easy',
    name: { en: 'Field Grasshopper', id: 'Belalang Ladang' },
    scientificName: 'Valanga nigricornis',
    group: 'Insects',
    groupLabel: { en: 'Insect', id: 'Serangga' },
    syllabusFocus: {
      en: 'P4 3-Stage Life Cycle · Moulting',
      id: 'P4 Siklus Hidup 3 Tahap · Ganti Kulit',
    },
    habitat: {
      en: 'Sunlit Fern Understorey',
      id: 'Pakis Bawah Tajuk yang Cerah',
    },
    summary: {
      en: 'A sturdy Javanese bird grasshopper common along Singapore forest edges with powerful jumping legs.',
      id: 'Belalang hijau kekar yang umum ditemukan di tepi hutan Singapura dengan kaki belakang pelompat yang kuat.',
    },
    spawnXZ: [-6.4, -7.2],
    perchHeight: 0.45,
    worldScale: 1.25,
    inspectDistance: 1.85,
    inspectTargetY: 0.16,
    initialYaw: 0.65,
    perchType: 'fern',
    hotspots: [
      {
        id: 'hind-legs',
        label: { en: 'Muscular Hind Legs', id: 'Kaki Belakang Berotot' },
        conceptTag: { en: 'Escape Movement', id: 'Gerak Menghindar' },
        explanation: {
          en: 'Its third pair of jointed legs is long and muscular, acting like springs so the grasshopper can leap more than 20 times its body length to escape birds and lizards.',
          id: 'Pasangan kaki beruas ketiganya panjang dan berotot seperti pegas sehingga belalang dapat melompat lebih dari 20 kali panjang tubuhnya untuk menghindari burung dan kadal.',
        },
        anchor: [0.22, 0.24, -0.15],
      },
      {
        id: 'head-eyes',
        label: { en: 'Compound Eyes & Antennae', id: 'Mata Majemuk & Antena' },
        conceptTag: { en: 'Wide-Angle Vision', id: 'Penglihatan Luas' },
        explanation: {
          en: 'Large compound eyes made of hundreds of tiny lenses detect rapid movement from nearly every direction, while short antennae sense touch and plant chemicals.',
          id: 'Mata majemuk besar yang tersusun dari ratusan lensa kecil mendeteksi gerakan cepat dari hampir semua arah, sedangkan antena pendek merasakan sentuhan dan aroma tumbuhan.',
        },
        anchor: [0, 0.26, 0.4],
      },
      {
        id: 'exoskeleton',
        label: { en: 'Hard Outer Covering', id: 'Rangka Luar Keras' },
        conceptTag: { en: 'Exoskeleton & Moulting', id: 'Eksoskeleton & Ganti Kulit' },
        explanation: {
          en: 'An insect’s hard outer covering protects its soft internal organs. Because this shell cannot stretch, the young nymph must shed (moult) it repeatedly to grow larger.',
          id: 'Rangka luar yang keras melindungi organ dalam yang lunak. Karena cangkang ini tidak bisa melar, nimfa muda harus berganti kulit berulang kali agar dapat tumbuh besar.',
        },
        anchor: [0, 0.2, 0.05],
      },
      {
        id: 'three-stage',
        label: { en: '3-Stage Life Cycle', id: 'Siklus Hidup 3 Tahap' },
        conceptTag: { en: 'Incomplete Metamorphosis', id: 'Metamorfosis Tidak Sempurna' },
        explanation: {
          en: 'Unlike butterflies, grasshoppers have a 3-stage life cycle: Egg → Nymph → Adult. The nymph already looks like a miniature wingless adult and develops wings only after its final moult.',
          id: 'Berbeda dengan kupu-kupu, belalang memiliki siklus hidup 3 tahap: Telur → Nimfa → Dewasa. Nimfa sudah mirip versi mini dewasa tanpa sayap, dan sayapnya baru muncul setelah ganti kulit terakhir.',
        },
        anchor: [-0.15, 0.14, -0.35],
      },
    ],
    quiz: {
      question: {
        en: 'How does the life cycle of a Field Grasshopper differ from that of a Common Rose Butterfly?',
        id: 'Bagaimana perbedaan siklus hidup Belalang Ladang dibandingkan Kupu-kupu Mawar?',
      },
      options: [
        { en: 'The grasshopper has a pupa stage while the butterfly does not.', id: 'Belalang memiliki tahap pupa sedangkan kupu-kupu tidak.' },
        { en: 'The grasshopper has 3 stages and its young (nymph) resembles the adult.', id: 'Belalang memiliki 3 tahap dan anaknya (nimfa) menyerupai induk dewasa.' },
        { en: 'The grasshopper gives birth to live young instead of laying eggs.', id: 'Belalang melahirkan anak secara langsung alih-alih bertelur.' },
        { en: 'The grasshopper’s young lives underwater like a tadpole.', id: 'Anak belalang hidup di dalam air seperti berudu.' },
      ],
      correctIndex: 1,
      explanation: {
        en: 'Grasshoppers (like cockroaches) have a 3-stage life cycle (Egg → Nymph → Adult) with no pupa stage, and the nymph looks similar to the adult except it is smaller and wingless.',
        id: 'Belalang (seperti kecoa) memiliki siklus hidup 3 tahap (Telur → Nimfa → Dewasa) tanpa tahap pupa, dan nimfanya mirip dewasa tetapi lebih kecil serta belum bersayap.',
      },
      points: 50,
    },
  },

  {
    id: 'green-tree-frog',
    difficulty: 'easy',
    name: { en: 'Green Tree Frog', id: 'Katak Pohon Hijau' },
    scientificName: 'Polypedates leucomystax',
    group: 'Amphibians',
    groupLabel: { en: 'Amphibian', id: 'Amfibi' },
    syllabusFocus: {
      en: 'P3 Amphibians & P4 3-Stage Life Cycle',
      id: 'P3 Amfibi & P4 Siklus Hidup 3 Tahap',
    },
    habitat: {
      en: 'Mossy Boulder beside the Forest Pond',
      id: 'Batu Berlumut di Tepi Kolam Hutan',
    },
    summary: {
      en: 'An agile rainforest amphibian that lives on land and breeds in quiet forest pools.',
      id: 'Amfibi hutan hujan yang lincah, hidup di darat dan berkembang biak di kolam hutan yang tenang.',
    },
    spawnXZ: [8.8, 3.6],
    perchHeight: 0.42,
    worldScale: 1.2,
    inspectDistance: 1.85,
    inspectTargetY: 0.22,
    initialYaw: -2.1,
    perchType: 'mossRock',
    hotspots: [
      {
        id: 'moist-skin',
        label: { en: 'Moist Permeable Skin', id: 'Kulit Lembap & Tipis' },
        conceptTag: { en: 'Dual Breathing · Amphibian', id: 'Pernapasan Ganda · Amfibi' },
        explanation: {
          en: 'Amphibians have smooth, moist skin without scales. Adult frogs breathe through their lungs on land AND absorb dissolved oxygen directly through their moist skin underwater.',
          id: 'Amfibi memiliki kulit halus dan lembap tanpa sisik. Katak dewasa bernapas dengan paru-paru di darat DAN menyerap oksigen terlarut langsung melalui kulit lembapnya di dalam air.',
        },
        anchor: [0, 0.34, -0.05],
      },
      {
        id: 'toe-pads',
        label: { en: 'Webbed Feet & Toe Pads', id: 'Kaki Berselaput & Bantalan Jari' },
        conceptTag: { en: 'Climbing & Swimming', id: 'Memanjat & Berenang' },
        explanation: {
          en: 'Sticky suction pads on its fingertips let it cling to wet rainforest leaves, while webbed hind toes help push water efficiently when swimming in the pond.',
          id: 'Bantalan perekat di ujung jarinya membuatnya mampu menempel pada daun hutan yang basah, sedangkan selaput di kaki belakang mendorong air secara efisien saat berenang.',
        },
        anchor: [0.24, 0.08, 0.22],
      },
      {
        id: 'vocal-sac',
        label: { en: 'Eyes & Vocal Throat', id: 'Mata Menonjol & Kantung Suara' },
        conceptTag: { en: 'Insect Hunter', id: 'Pemburu Serangga' },
        explanation: {
          en: 'Bulging golden eyes give nearly 360° vision to spot insects above the pond, and a sticky flip-out tongue catches mosquitoes and beetles in a fraction of a second.',
          id: 'Mata keemasan yang menonjol memberi penglihatan hampir 360° untuk mengintai serangga, dan lidah lengketnya menangkap nyamuk serta kumbang dalam sekejap.',
        },
        anchor: [0, 0.36, 0.26],
      },
      {
        id: 'tadpole-cycle',
        label: { en: 'Jelly Eggs → Tadpole → Adult', id: 'Telur Jeli → Berudu → Dewasa' },
        conceptTag: { en: '3-Stage Amphibian Cycle', id: 'Siklus 3 Tahap Amfibi' },
        explanation: {
          en: 'Frogs lay shell-less jelly-like eggs in water. The young (tadpole) lives completely in water, breathes with gills, and has a tail—unlike its lung-breathing adult parent!',
          id: 'Katak bertelur tanpa cangkang keras di air. Anaknya (berudu) hidup sepenuhnya di air, bernapas dengan insang, dan berekor—berbeda dengan induk dewasanya yang berparu-paru!',
        },
        anchor: [-0.2, 0.22, -0.22],
      },
    ],
    quiz: {
      question: {
        en: 'Which statement correctly describes how a frog breathes at different stages of its life cycle?',
        id: 'Pernyataan manakah yang benar mengenai cara katak bernapas pada tahap siklus hidup yang berbeda?',
      },
      options: [
        { en: 'Tadpoles breathe through lungs; adult frogs breathe only through gills.', id: 'Berudu bernapas dengan paru-paru; katak dewasa hanya dengan insang.' },
        { en: 'Tadpoles breathe through gills in water; adult frogs breathe through lungs and moist skin.', id: 'Berudu bernapas dengan insang di air; katak dewasa bernapas dengan paru-paru dan kulit lembap.' },
        { en: 'Both tadpoles and adult frogs breathe only through dry scaly skin.', id: 'Baik berudu maupun katak dewasa hanya bernapas melalui kulit bersisik kering.' },
        { en: 'Adult frogs do not need oxygen when sitting on mossy rocks.', id: 'Katak dewasa tidak memerlukan oksigen saat duduk di batu berlumut.' },
      ],
      correctIndex: 1,
      explanation: {
        en: 'Tadpoles are aquatic and breathe dissolved oxygen using gills. As they develop into adult frogs, gills disappear and they breathe using lungs on land and moist skin in water.',
        id: 'Berudu hidup di air dan bernapas dengan insang. Saat tumbuh menjadi katak dewasa, insang menghilang dan katak bernapas menggunakan paru-paru di darat serta kulit lembap di air.',
      },
      points: 50,
    },
  },

  {
    id: 'oriental-pied-hornbill',
    difficulty: 'easy',
    name: { en: 'Oriental Pied Hornbill', id: 'Enggang Kelingking' },
    scientificName: 'Anthracoceros albirostris',
    group: 'Birds',
    groupLabel: { en: 'Bird', id: 'Burung' },
    syllabusFocus: {
      en: 'P3 Birds · Feathers, Beak & Reproduction',
      id: 'P3 Burung · Bulu, Paruh & Reproduksi',
    },
    habitat: {
      en: 'Low Canopy Bough near the Clearing',
      id: 'Dahan Rendah di Tepi Area Terbuka',
    },
    summary: {
      en: 'Singapore’s iconic wild forest hornbill—a conservation success story returned to Bukit Timah and Pulau Ubin.',
      id: 'Burung enggang hutan ikonik Singapura—kisah sukses konservasi yang kembali hadir di Bukit Timah dan Pulau Ubin.',
    },
    spawnXZ: [-9.2, 4.5],
    perchHeight: 1.55,
    worldScale: 1.1,
    inspectDistance: 2.35,
    inspectTargetY: 0.45,
    initialYaw: 1.15,
    perchType: 'branch',
    hotspots: [
      {
        id: 'beak-casque',
        label: { en: 'Curved Beak & Casque', id: 'Paruh Melengkung & Balung' },
        conceptTag: { en: 'Bird Feature · Seed Dispersal', id: 'Ciri Burung · Penyebar Biji' },
        explanation: {
          en: 'All birds have a beak instead of teeth. The hornbill’s long curved bill plucks rainforest figs from thin branches, while the hollow yellow casque above acts as a lightweight sound chamber.',
          id: 'Semua burung memiliki paruh, bukan gigi. Paruh panjang melengkungnya memetik buah ara dari dahan tipis, sedangkan balung kuning berongga di atasnya berfungsi sebagai ruang resonansi suara.',
        },
        anchor: [0, 0.72, 0.56],
      },
      {
        id: 'feathers',
        label: { en: 'Black & White Feathers', id: 'Bulu Hitam & Putih' },
        conceptTag: { en: 'Unique to Birds', id: 'Ciri Khas Burung' },
        explanation: {
          en: 'Feathers are the ONLY outer covering exclusive to birds! They trap warm air to keep the body warm, keep rain out, and form smooth broad wings for gliding between tall rainforest trees.',
          id: 'Bulu adalah SATU-SATUNYA penutup tubuh yang hanya dimiliki burung! Bulu memerangkap udara hangat, menahan air hujan, dan membentuk sayap lebar untuk meluncur antarpohon tinggi.',
        },
        anchor: [0.34, 0.42, -0.05],
      },
      {
        id: 'feet-claws',
        label: { en: 'Two Legs & Grasping Claws', id: 'Dua Kaki & Cakar Pencengkeram' },
        conceptTag: { en: 'Perching Structure', id: 'Struktur Bertengger' },
        explanation: {
          en: 'Birds have two legs with strong grasping toes so they can grip mossy rainforest branches firmly without slipping, even while reaching out for fruits.',
          id: 'Burung memiliki dua kaki dengan jari pencengkeram kuat agar dapat berpegangan erat pada dahan hutan berlumut tanpa terpeleset saat meraih buah.',
        },
        anchor: [0.06, 0.04, 0.05],
      },
      {
        id: 'hard-eggs',
        label: { en: 'Hard-Shelled Eggs in Tree Hollows', id: 'Telur Bercangkang Keras di Lubang Pohon' },
        conceptTag: { en: 'Bird Reproduction', id: 'Reproduksi Burung' },
        explanation: {
          en: 'Birds reproduce by laying eggs with hard shells. Mother hornbills seal themselves inside tree cavities with mud, leaving a narrow slit for the father to deliver fruit until the chicks fledge!',
          id: 'Burung berkembang biak dengan bertelur bercangkang keras. Induk betina enggang menutup lubang sarang pohon dengan lumpur, menyisakan celah kecil agar jantan menyuapkan buah sampai anak siap terbang!',
        },
        anchor: [0, 0.34, -0.46],
      },
    ],
    quiz: {
      question: {
        en: 'Which characteristic belongs ONLY to birds like the Oriental Pied Hornbill and NO other animal group?',
        id: 'Ciri manakah yang HANYA dimiliki burung seperti Enggang Kelingking dan TIDAK dimiliki kelompok hewan lainnya?',
      },
      options: [
        { en: 'Ability to fly in the air', id: 'Kemampuan terbang di udara' },
        { en: 'Laying eggs to reproduce', id: 'Bertelur untuk berkembang biak' },
        { en: 'Having feathers as an outer body covering', id: 'Memiliki bulu sebagai penutup tubuh' },
        { en: 'Having two eyes and a backbone', id: 'Memiliki dua mata dan tulang belakang' },
      ],
      correctIndex: 2,
      explanation: {
        en: 'Insects and bats can fly, and reptiles, fish, amphibians, and insects lay eggs—but ONLY birds have feathers!',
        id: 'Serangga dan kelelawar bisa terbang, serta reptil, ikan, amfibi, dan serangga bertelur—tetapi HANYA burung yang memiliki bulu!',
      },
      points: 50,
    },
  },

  // =========================================================================
  // MEDIUM — Primary 5–6 Standard (Adaptations & Food Webs)
  // =========================================================================
  {
    id: 'malayan-stick-insect',
    difficulty: 'medium',
    name: { en: 'Malayan Stick Insect', id: 'Belalang Ranting Malaya' },
    scientificName: 'Lonchodes brevipes',
    group: 'Insects',
    groupLabel: { en: 'Insect', id: 'Serangga' },
    syllabusFocus: {
      en: 'P6 Structural & Behavioural Adaptations',
      id: 'P6 Adaptasi Struktural & Perilaku',
    },
    habitat: {
      en: 'Fallen Deadwood Branch',
      id: 'Dahan Kayu Kering',
    },
    summary: {
      en: 'A master of rainforest camouflage whose elongated brown body blends invisibly against woody twigs.',
      id: 'Ahli kamuflase hutan hujan yang tubuh cokelat memanjangnya menyatu sempurna dengan ranting kayu.',
    },
    spawnXZ: [-8.5, -3.5],
    perchHeight: 0.72,
    worldScale: 1.25,
    inspectDistance: 2.0,
    inspectTargetY: 0.14,
    initialYaw: 0.9,
    perchType: 'deadwood',
    hotspots: [
      {
        id: 'twig-body',
        label: { en: 'Twig-Shaped Body', id: 'Tubuh Menyerupai Ranting' },
        conceptTag: { en: 'Structural Adaptation · Camouflage', id: 'Adaptasi Struktural · Kamuflase' },
        explanation: {
          en: 'Its slender segmented brown thorax and abdomen mimic bark knots and twigs. This structural adaptation helps it blend into the background so predators like birds cannot spot it.',
          id: 'Dada dan perutnya yang ramping kecokelatan menyerupai ranting dan simpul kulit kayu. Adaptasi struktural ini membantunya menyamar dari pemangsa seperti burung.',
        },
        anchor: [0, 0.16, 0],
      },
      {
        id: 'swaying-behaviour',
        label: { en: 'Wind-Swaying Motion', id: 'Gerakan Bergoyang Seperti Angin' },
        conceptTag: { en: 'Behavioural Adaptation', id: 'Adaptasi Perilaku' },
        explanation: {
          en: 'When walking or startled, it rocks gently side-to-side like a twig blowing in a forest breeze—and may even freeze completely ("playing dead") to fool sharp-eyed predators.',
          id: 'Saat berjalan atau terkejut, ia bergoyang pelan ke kiri-kanan seperti ranting tertiup angin hutan—bahkan dapat diam kaku ("pura-pura mati") untuk mengecoh pemangsa.',
        },
        anchor: [0.22, 0.1, 0.25],
      },
      {
        id: 'long-antennae',
        label: { en: 'Nocturnal Feelers', id: 'Antena Aktif Malam' },
        conceptTag: { en: 'Behavioural · Nocturnal', id: 'Perilaku · Nokturnal' },
        explanation: {
          en: 'Stick insects stay motionless by day and feed on leaves at night (nocturnal behaviour), using long thread-like antennae to feel branches in the dark.',
          id: 'Belalang ranting diam tak bergerak di siang hari dan makan daun di malam hari (perilaku nokturnal), menggunakan antena panjang seperti benang untuk meraba dahan dalam gelap.',
        },
        anchor: [0, 0.18, 0.56],
      },
      {
        id: 'herbivore-web',
        label: { en: 'Primary Consumer (Herbivore)', id: 'Konsumen Primer (Herbivora)' },
        conceptTag: { en: 'Forest Food Chain', id: 'Rantai Makanan Hutan' },
        explanation: {
          en: 'In the rainforest food web, it is a plant-eater (primary consumer) transferring energy from forest leaves to insect-eating birds, frogs, and spiders.',
          id: 'Dalam jaring makanan hutan, ia adalah pemakan tumbuhan (konsumen primer) yang menyalurkan energi dari daun hutan ke burung, katak, dan laba-laba pemakan serangga.',
        },
        anchor: [0, 0.14, -0.45],
      },
    ],
    quiz: {
      question: {
        en: 'Which pair correctly classifies the Malayan Stick Insect’s adaptations for escaping predators?',
        id: 'Pasangan manakah yang mengklasifikasikan adaptasi Belalang Ranting Malaya dengan tepat untuk menghindari pemangsa?',
      },
      options: [
        { en: 'Structural: Swaying in the wind · Behavioural: Brown twig shape', id: 'Struktural: Bergoyang tertiup angin · Perilaku: Bentuk ranting cokelat' },
        { en: 'Structural: Slender twig-like body · Behavioural: Swaying gently and staying nocturnal', id: 'Struktural: Tubuh ramping seperti ranting · Perilaku: Bergoyang pelan dan aktif malam hari' },
        { en: 'Structural: Nocturnal feeding · Behavioural: Hard exoskeleton', id: 'Struktural: Makan malam hari · Perilaku: Eksoskeleton keras' },
        { en: 'Structural: Living in water · Behavioural: Bright red warning wings', id: 'Struktural: Hidup di air · Perilaku: Sayap merah peringatan' },
      ],
      correctIndex: 1,
      explanation: {
        en: 'Structural adaptations are physical body features (twig-like body shape and brown colour), while behavioural adaptations are actions an animal does (swaying like a twig, freezing, feeding at night).',
        id: 'Adaptasi struktural adalah ciri fisik tubuh (bentuk dan warna seperti ranting), sedangkan adaptasi perilaku adalah tindakan hewan (bergoyang seperti ranting, diam membeku, aktif malam hari).',
      },
      points: 75,
    },
  },

  {
    id: 'sunda-pangolin',
    difficulty: 'medium',
    name: { en: 'Sunda Pangolin', id: 'Trenggiling Sunda' },
    scientificName: 'Manis javanica',
    group: 'Mammals',
    groupLabel: { en: 'Mammal', id: 'Mamalia' },
    syllabusFocus: {
      en: 'P6 Adaptations for Protection & Feeding',
      id: 'P6 Adaptasi Perlindungan & Cara Makan',
    },
    habitat: {
      en: 'Mossy Buttress Roots · Bukit Timah Understorey',
      id: 'Akar Banir Berlumut · Lantai Hutan Bukit Timah',
    },
    summary: {
      en: 'A critically endangered native Singapore mammal armoured in overlapping keratin scales.',
      id: 'Mamalia asli Singapura yang sangat terancam punah dan terlindung oleh sisik keratin bertumpuk.',
    },
    spawnXZ: [2.4, 9.8],
    perchHeight: 0.02,
    worldScale: 1.05,
    inspectDistance: 2.35,
    inspectTargetY: 0.32,
    initialYaw: -2.5,
    perchType: 'roots',
    hotspots: [
      {
        id: 'keratin-scales',
        label: { en: 'Overlapping Keratin Scales', id: 'Sisik Keratin Bertumpuk' },
        conceptTag: { en: 'Structural · Armour & Mammal', id: 'Struktural · Pelindung & Mamalia' },
        explanation: {
          en: 'Despite looking scaly like a reptile, the Sunda Pangolin is a MAMMAL—it gives birth to live young, feeds them milk, and has hair on its belly! Its hard scales are fused keratin (like fingernails).',
          id: 'Meski bersisik seperti reptil, Trenggiling Sunda adalah MAMALIA—ia melahirkan anak, menyusui, dan memiliki rambut di perutnya! Sisik kerasnya terbuat dari keratin (seperti kuku).',
        },
        anchor: [0, 0.45, -0.05],
      },
      {
        id: 'curling-tail',
        label: { en: 'Prehensile Tail & Ball Defence', id: 'Ekor Penggenggam & Gulung Diri' },
        conceptTag: { en: 'Behavioural Adaptation', id: 'Adaptasi Perilaku' },
        explanation: {
          en: 'When threatened by predators, it curls tightly into an armoured ball (behavioural adaptation) tucking its soft snout inside. Its muscular tail also helps grip tree trunks when climbing.',
          id: 'Saat terancam pemangsa, ia menggulung erat menjadi bola berlapis sisik (adaptasi perilaku) untuk melindungi moncongnya yang lunak. Ekor berototnya juga membantu memanjat pohon.',
        },
        anchor: [0, 0.25, -0.78],
      },
      {
        id: 'digging-claws',
        label: { en: 'Curved Digging Claws', id: 'Cakar Penggali Melengkung' },
        conceptTag: { en: 'Structural · Obtaining Food', id: 'Struktural · Mendapat Makanan' },
        explanation: {
          en: 'Long, powerful front claws rip open hard termite mounds and ant nests in rotting logs. It walks on the sides of its front knuckles to keep those claws sharp!',
          id: 'Cakar depan panjang dan kuat merobek sarang rayap serta semut di kayu lapuk. Ia berjalan dengan sisi buku jarinya agar cakarnya tetap tajam!',
        },
        anchor: [0.24, 0.14, 0.36],
      },
      {
        id: 'sticky-tongue',
        label: { en: 'Toothless Snout & Sticky Tongue', id: 'Moncong Tanpa Gigi & Lidah Lengket' },
        conceptTag: { en: 'Insectivore · Food Web', id: 'Insektivora · Jaring Makanan' },
        explanation: {
          en: 'Pangolins have no teeth; instead, a sticky tongue longer than their head reaches deep into ant tunnels, helping control forest ant and termite populations naturally.',
          id: 'Trenggiling tidak bergigi; lidah lengketnya yang lebih panjang dari kepalanya menjangkau jauh ke dalam terowongan semut, membantu menjaga keseimbangan populasi semut dan rayap hutan.',
        },
        anchor: [0, 0.24, 0.68],
      },
    ],
    quiz: {
      question: {
        en: 'Why is the Sunda Pangolin classified as a mammal even though its back is covered in hard scales?',
        id: 'Mengapa Trenggiling Sunda diklasifikasikan sebagai mamalia meskipun punggungnya tertutup sisik keras?',
      },
      options: [
        { en: 'It lays leathery eggs under tree roots.', id: 'Ia meletakkan telur berkulit lentur di bawah akar pohon.' },
        { en: 'It gives birth to live young, suckles them with milk, and has hair on its underside.', id: 'Ia melahirkan anak, menyusui dengan susu, dan memiliki rambut di bagian bawah tubuhnya.' },
        { en: 'It breathes through gills when crossing forest streams.', id: 'Ia bernapas menggunakan insang saat menyeberangi sungai hutan.' },
        { en: 'It is cold-blooded and relies on sunlight to warm its scales.', id: 'Ia berdarah dingin dan bergantung pada matahari untuk menghangatkan sisiknya.' },
      ],
      correctIndex: 1,
      explanation: {
        en: 'Mammals give birth to live young (except platypus/echidna), produce milk to nourish their young, and have hair/fur—the pangolin has fine hairs on its belly and face, and its scales are modified keratin.',
        id: 'Mamalia melahirkan anak, menghasilkan susu untuk menyusui anaknya, dan memiliki rambut—trenggiling memiliki rambut halus di perut dan wajah, sementara sisiknya adalah keratin yang termodifikasi.',
      },
      points: 75,
    },
  },

  {
    id: 'giant-mudskipper',
    difficulty: 'medium',
    name: { en: 'Giant Mudskipper', id: 'Ikan Glodok Raksasa' },
    scientificName: 'Periophthalmodon schlosseri',
    group: 'Fish',
    groupLabel: { en: 'Fish', id: 'Ikan' },
    syllabusFocus: {
      en: 'P6 Adaptations for Breathing & Moving on Land',
      id: 'P6 Adaptasi Bernapas & Bergerak di Darat',
    },
    habitat: {
      en: 'Muddy Pond Edge & Roots',
      id: 'Tepi Kolam Berlumpur & Akar',
    },
    summary: {
      en: 'An extraordinary amphibious fish found in Singapore’s wetlands that walks on mudflats and skips across shallow water.',
      id: 'Ikan amfibi luar biasa yang ditemukan di lahan basah Singapura, mampu berjalan di lumpur dan melompat di air dangkal.',
    },
    spawnXZ: [11.6, -2.4],
    perchHeight: 0.04,
    worldScale: 1.25,
    inspectDistance: 1.95,
    inspectTargetY: 0.18,
    initialYaw: -1.8,
    perchType: 'mudbank',
    hotspots: [
      {
        id: 'gill-chambers',
        label: { en: 'Enlarged Gill Chambers', id: 'Rongga Insang Membesar' },
        conceptTag: { en: 'Structural · Breathing on Land', id: 'Struktural · Bernapas di Darat' },
        explanation: {
          en: 'As a fish, it breathes using gills—NOT lungs! Its swollen gill chambers trap water like tiny scuba tanks so its gills stay wet and extract dissolved oxygen while on land.',
          id: 'Sebagai ikan, ia bernapas dengan insang—BUKAN paru-paru! Rongga insangnya yang besar menahan air seperti tabung selam agar insang tetap basah dan menyerap oksigen saat di darat.',
        },
        anchor: [0.18, 0.2, 0.24],
      },
      {
        id: 'pectoral-fins',
        label: { en: 'Muscular Pectoral Fins', id: 'Sirip Dada Berotot' },
        conceptTag: { en: 'Structural · Movement', id: 'Struktural · Gerak di Lumpur' },
        explanation: {
          en: 'Its sturdy, elbow-like pectoral fins work like crutches, letting the mudskipper haul itself across muddy banks and even climb low roots to hunt crabs and insects.',
          id: 'Sirip dadanya yang kekar seperti siku berfungsi bak tongkat penopang, membuat ikan glodok merangkak di tepian lumpur dan memanjat akar rendah untuk berburu kepiting serta serangga.',
        },
        anchor: [0.24, 0.06, 0.12],
      },
      {
        id: 'turret-eyes',
        label: { en: 'Periscopic Turret Eyes', id: 'Mata Menonjol Seperti Periskop' },
        conceptTag: { en: 'Predator Detection', id: 'Deteksi Pemangsa' },
        explanation: {
          en: 'Mounted high on top of its head, its rotating eyes scan above the waterline for wading birds. It regularly retracts its eyes into wet sockets to keep them moist!',
          id: 'Terletak tinggi di atas kepala, matanya yang dapat berputar memantau burung pemangsa di atas permukaan air. Ia rutin menarik matanya ke rongga basah agar tetap lembap!',
        },
        anchor: [0, 0.34, 0.32],
      },
      {
        id: 'dorsal-tail',
        label: { en: 'Sail Dorsal Fin & Mud Burrow', id: 'Sirip Punggung & Liang Lumpur' },
        conceptTag: { en: 'Behavioural · Territory & Eggs', id: 'Perilaku · Teritori & Telur' },
        explanation: {
          en: 'It raises its tall spotted dorsal fin to warn rivals away from its mud burrow, where it gulps air down into an underground chamber to keep its developing eggs oxygenated.',
          id: 'Ia menegakkan sirip punggung berbintiknya untuk mengusir pesaing dari liang lumpurnya, tempat ia membawa gelembung udara ke ruang bawah tanah agar telur tetap mendapat oksigen.',
        },
        anchor: [0, 0.32, -0.24],
      },
    ],
    quiz: {
      question: {
        en: 'A student sees a Giant Mudskipper crawling on a mudbank out of water. How is it able to breathe while on land?',
        id: 'Seorang siswa melihat Ikan Glodok Raksasa merangkak di tepi lumpur di luar air. Bagaimana cara ikan ini bernapas saat berada di darat?',
      },
      options: [
        { en: 'It switches to dry lungs like a bird.', id: 'Ia beralih ke paru-paru kering seperti burung.' },
        { en: 'It holds water inside enlarged gill chambers and absorbs oxygen through moist skin and mouth lining.', id: 'Ia menyimpan air di rongga insang yang membesar serta menyerap oksigen melalui kulit lembap dan rongga mulut.' },
        { en: 'It stops breathing completely for several days.', id: 'Ia berhenti bernapas sepenuhnya selama beberapa hari.' },
        { en: 'It uses breathing tubes (spiracles) on its abdomen like an insect.', id: 'Ia menggunakan tabung napas (spirakel) di perut seperti serangga.' },
      ],
      correctIndex: 1,
      explanation: {
        en: 'Mudskippers are fish that carry water in enlarged gill chambers (keeping gills moist for gas exchange) and also absorb oxygen through moist skin and mouth membranes as long as they stay wet.',
        id: 'Ikan glodok adalah ikan yang membawa air di rongga insang besar (menjaga insang tetap lembap untuk pertukaran gas) sekaligus menyerap oksigen lewat kulit dan selaput mulut yang basah.',
      },
      points: 75,
    },
  },

  {
    id: 'weaver-ant',
    difficulty: 'medium',
    name: { en: 'Weaver Ant', id: 'Semut Rangrang' },
    scientificName: 'Oecophylla smaragdina',
    group: 'Insects',
    groupLabel: { en: 'Insect', id: 'Serangga' },
    syllabusFocus: {
      en: 'P5–6 Living Together · Behavioural Adaptation',
      id: 'P5–6 Hidup Berkoloni · Adaptasi Perilaku',
    },
    habitat: {
      en: 'Stitched Canopy Leaf Nest',
      id: 'Sarang Daun Berjahit di Dahan',
    },
    summary: {
      en: 'Fiery amber social ants famous across Singapore’s parks for weaving living leaves into aerial nests.',
      id: 'Semut sosial berwarna jingga menyala yang terkenal di taman-taman Singapura karena menjahit daun hidup menjadi sarang.',
    },
    spawnXZ: [5.4, -12.6],
    perchHeight: 1.25,
    worldScale: 1.35,
    inspectDistance: 1.85,
    inspectTargetY: 0.14,
    initialYaw: -0.4,
    perchType: 'leafNest',
    hotspots: [
      {
        id: 'mandibles',
        label: { en: 'Serrated Mandibles', id: 'Rahang Bergerigi Kuat' },
        conceptTag: { en: 'Structural · Prey & Building', id: 'Struktural · Berburu & Membangun' },
        explanation: {
          en: 'Powerful scissor-like jaws grip leaf edges and capture caterpillars or beetles much larger than one ant, defending the host tree from leaf-eating pests.',
          id: 'Rahang kuat seperti gunting mencengkeram tepi daun dan menangkap ulat atau kumbang yang jauh lebih besar, melindungi pohon inang dari hama pemakan daun.',
        },
        anchor: [0, 0.18, 0.42],
      },
      {
        id: 'living-chain',
        label: { en: 'Co-operative Living Bridges', id: 'Jembatan Hidup Gotong Royong' },
        conceptTag: { en: 'Behavioural Adaptation', id: 'Adaptasi Perilaku' },
        explanation: {
          en: 'Workers link legs and jaws into living chains to pull distant leaves together, while other workers gently squeeze their own larvae to produce sticky silk glue!',
          id: 'Semut pekerja saling mengaitkan kaki dan rahang membentuk rantai hidup untuk menarik daun yang berjauhan, sementara pekerja lain menggunakan sutra lengket dari larvanya sebagai lem!',
        },
        anchor: [0.22, 0.12, 0.1],
      },
      {
        id: 'amber-gaster',
        label: { en: 'Formic Acid Defence', id: 'Pertahanan Asam Format' },
        conceptTag: { en: 'Predator Deterrent', id: 'Penangkal Pemangsa' },
        explanation: {
          en: 'When the nest is disturbed, workers raise their abdomen (gaster) and spray stinging formic acid to drive away birds, lizards, and curious mammals.',
          id: 'Saat sarang terganggu, pekerja mengangkat perutnya dan menyemprotkan asam format yang perih untuk mengusir burung, kadal, dan mamalia.',
        },
        anchor: [0, 0.24, -0.36],
      },
      {
        id: 'mutualism',
        label: { en: 'Tree Community Relationship', id: 'Hubungan Komunitas Pohon' },
        conceptTag: { en: 'P6 Habitat Community', id: 'P6 Komunitas Habitat' },
        explanation: {
          en: 'The tree provides shelter and nectar-producing insects, while Weaver Ants protect the tree by hunting herbivorous caterpillars—a key interaction in a tree community.',
          id: 'Pohon menyediakan tempat berlindung dan sumber nektar, sementara Semut Rangrang melindungi pohon dengan memburu ulat pemakan daun—interaksi penting dalam komunitas pohon.',
        },
        anchor: [-0.24, 0.18, -0.05],
      },
    ],
    quiz: {
      question: {
        en: 'If all Weaver Ants were removed from a fruiting forest tree, what is the most likely short-term effect on the tree community?',
        id: 'Jika semua Semut Rangrang hilang dari pohon buah hutan, dampak jangka pendek manakah yang paling mungkin terjadi pada komunitas pohon tersebut?',
      },
      options: [
        { en: 'The tree will immediately stop needing sunlight for photosynthesis.', id: 'Pohon akan langsung berhenti membutuhkan cahaya matahari untuk fotosintesis.' },
        { en: 'Leaf-eating caterpillars will increase because fewer predators hunt them.', id: 'Populasi ulat pemakan daun akan meningkat karena pemangsanya berkurang.' },
        { en: 'The tree leaves will stitch themselves into nests automatically.', id: 'Daun pohon akan menjahit dirinya sendiri menjadi sarang secara otomatis.' },
        { en: 'All birds in the forest will become herbivores overnight.', id: 'Semua burung di hutan akan berubah menjadi herbivora dalam semalam.' },
      ],
      correctIndex: 1,
      explanation: {
        en: 'In a food web, removing a predator (Weaver Ants) reduces predation on its prey (leaf-eating caterpillars), causing the caterpillar population to increase and eat more leaves.',
        id: 'Dalam jaring makanan, hilangnya pemangsa (Semut Rangrang) mengurangi tekanan pada mangsanya (ulat pemakan daun), sehingga populasi ulat meningkat dan memakan lebih banyak daun.',
      },
      points: 75,
    },
  },

  // =========================================================================
  // HARD — PSLE Challenge & Lower Secondary Bridge
  // =========================================================================
  {
    id: 'leaf-mimic-katydid',
    difficulty: 'hard',
    name: { en: 'Leaf-Mimic Katydid', id: 'Belalang Daun Kriptik' },
    scientificName: 'Onomarchus uninotatus',
    group: 'Insects',
    groupLabel: { en: 'Insect', id: 'Serangga' },
    syllabusFocus: {
      en: 'PSLE Camouflage & Food Web Reasoning',
      id: 'Penalaran PSLE · Kamuflase & Jaring Makanan',
    },
    habitat: {
      en: 'Dense Understorey Broadleaf Shrub',
      id: 'Semak Berdaun Lebar Rimbun',
    },
    summary: {
      en: 'A cryptic nocturnal bush-cricket whose veined emerald wings even mimic tiny chewed spots and fungal blemishes.',
      id: 'Belalang semak nokturnal kriptik yang sayap hijau beruratnya bahkan meniru bekas gigitan serangga dan bercak jamur daun.',
    },
    spawnXZ: [-14.2, -9.8],
    perchHeight: 0.78,
    worldScale: 1.05,
    inspectDistance: 1.85,
    inspectTargetY: 0.2,
    initialYaw: 0.4,
    perchType: 'fern',
    hotspots: [
      {
        id: 'veined-wings',
        label: { en: 'Leaf-Vein Forewings', id: 'Sayap Depan Berurat Daun' },
        conceptTag: { en: 'Cryptic Mimicry · Survival', id: 'Mimikri Kriptik · Bertahan Hidup' },
        explanation: {
          en: 'Broad flattened forewings replicate a central midrib, branching veins, and brown decay spots. Even a sharp-eyed predator mistakes the motionless katydid for a real leaf.',
          id: 'Sayap depan lebar pipih meniru tulang daun utama, urat bercabang, dan bercak cokelat daun. Pemangsa bermata tajam pun mengira belalang yang diam ini sebagai daun asli.',
        },
        anchor: [0.18, 0.24, -0.1],
      },
      {
        id: 'whip-antennae',
        label: { en: 'Whip-Like Long Antennae', id: 'Antena Panjang Seperti Cambuk' },
        conceptTag: { en: 'Dichotomous Key Trait', id: 'Ciri Kunci Dikotomi' },
        explanation: {
          en: 'How do scientists separate a katydid from a grasshopper in a dichotomous key? Katydids have thread-like antennae LONGER than their entire body, whereas grasshoppers have short stubby antennae!',
          id: 'Bagaimana ilmuwan membedakan belalang daun dan belalang biasa dalam kunci dikotomi? Belalang daun punya antena benang LEBIH PANJANG dari tubuhnya, sedangkan belalang biasa berantena pendek!',
        },
        anchor: [0, 0.24, 0.44],
      },
      {
        id: 'leg-ears',
        label: { en: 'Acoustic Ears on Front Legs', id: 'Telinga Akustik di Kaki Depan' },
        conceptTag: { en: 'Sensory Adaptation', id: 'Adaptasi Sensorik' },
        explanation: {
          en: 'Tiny slit-like hearing organs (tympana) sit on its front legs to detect ultrasonic bat echolocation calls and listen for mates calling across the dark canopy.',
          id: 'Organ pendengaran celah mungil (timpana) terletak di kaki depannya untuk mendeteksi sonar ultrasonik kelelawar dan mendengar panggilan pasangan di tajuk hutan yang gelap.',
        },
        anchor: [0.16, 0.08, 0.24],
      },
      {
        id: 'ecosystem-link',
        label: { en: 'Canopy Food Web Link', id: 'Penghubung Jaring Makanan Tajuk' },
        conceptTag: { en: 'PSLE Multi-Concept', id: 'Multi-Konsep PSLE' },
        explanation: {
          en: 'Because it converts plant energy into protein for nocturnal owls, bats, and lizards, clearing broad-leaved forest shrubs removes both its camouflage shelter and its food source.',
          id: 'Karena mengubah energi tumbuhan menjadi protein bagi burung hantu, kelelawar, dan kadal, penebangan semak berdaun lebar menghilangkan sekaligus tempat kamuflase dan makanannya.',
        },
        anchor: [-0.14, 0.16, -0.35],
      },
    ],
    quiz: {
      question: {
        en: 'In a dichotomous key comparing two green insects (A: antennae longer than body; B: antennae shorter than head), which feature places the Leaf-Mimic Katydid in Group A?',
        id: 'Dalam kunci dikotomi yang membandingkan dua serangga hijau (A: antena lebih panjang dari tubuh; B: antena lebih pendek dari kepala), ciri manakah yang menempatkan Belalang Daun di Kelompok A?',
      },
      options: [
        { en: 'Its six jointed legs', id: 'Enam kakinya yang beruas' },
        { en: 'Its green chlorophyll colour', id: 'Warna hijau klorofilnya' },
        { en: 'Its whip-like antennae that exceed its body length', id: 'Antena seperti cambuk yang melebihi panjang tubuhnya' },
        { en: 'Its ability to lay eggs on leaves', id: 'Kemampuannya bertelur di atas daun' },
      ],
      correctIndex: 2,
      explanation: {
        en: 'A dichotomous key separates organisms using contrasting observable traits. Both katydids and grasshoppers have 6 legs and green colour, so antennae length is the diagnostic trait separating them.',
        id: 'Kunci dikotomi memisahkan organisme berdasarkan ciri teramati yang kontras. Keduanya berkaki 6 dan berwarna hijau, sehingga panjang antena menjadi ciri pembeda utamanya.',
      },
      points: 100,
    },
  },

  {
    id: 'rhinoceros-beetle',
    difficulty: 'hard',
    name: { en: 'Asiatic Rhinoceros Beetle', id: 'Kumbang Badak Asia' },
    scientificName: 'Oryctes rhinoceros',
    group: 'Insects',
    groupLabel: { en: 'Insect', id: 'Serangga' },
    syllabusFocus: {
      en: 'PSLE Decomposers & Nutrient Cycling',
      id: 'PSLE Pengurai & Siklus Nutrisi',
    },
    habitat: {
      en: 'Rotting Dipterocarp Log on Forest Floor',
      id: 'Batang Pohon Lapuk di Lantai Hutan',
    },
    summary: {
      en: 'A heavily armoured nocturnal beetle whose grubs break down decaying rainforest timber into fertile soil.',
      id: 'Kumbang nokturnal berperisai tebal yang larvanya membantu menghancurkan kayu hutan lapuk menjadi tanah subur.',
    },
    spawnXZ: [-3.8, 13.8],
    perchHeight: 0.36,
    worldScale: 1.15,
    inspectDistance: 1.85,
    inspectTargetY: 0.16,
    initialYaw: 2.3,
    perchType: 'rottingLog',
    hotspots: [
      {
        id: 'cephalic-horn',
        label: { en: 'Curved Cephalic Horn', id: 'Tanduk Melengkung' },
        conceptTag: { en: 'Structural · Mate Competition', id: 'Struktural · Persaingan Pasangan' },
        explanation: {
          en: 'Male beetles grow a curved chitin horn to pry rival males off sap flows and burrow into fibrous bark—lifting up to 30 times their own body weight!',
          id: 'Kumbang jantan menumbuhkan tanduk kitin melengkung untuk mendorong pesaing dari aliran getah dan menggali kulit kayu—mampu mengangkat hingga 30 kali berat tubuhnya!',
        },
        anchor: [0, 0.24, 0.42],
      },
      {
        id: 'elytra',
        label: { en: 'Hardened Wing-Cases (Elytra)', id: 'Perisai Sayap Keras (Elitra)' },
        conceptTag: { en: 'Protection & Flight', id: 'Perlindungan & Terbang' },
        explanation: {
          en: 'The glossy dark front wings are modified into rigid armour shields (elytra) that protect the delicate folded hind flight wings while tunnelling through rough rotting wood.',
          id: 'Sayap depan gelap mengilap termodifikasi menjadi perisai keras (elitra) yang melindungi sayap terbang belakang yang tipis saat menggali kayu lapuk yang kasar.',
        },
        anchor: [0.16, 0.22, -0.14],
      },
      {
        id: 'detritivore-grub',
        label: { en: 'Wood-Breaking Larvae', id: 'Larva Penghancur Kayu Lapuk' },
        conceptTag: { en: 'Decomposer Partnership', id: 'Kemitraan Pengurai' },
        explanation: {
          en: 'Its fat C-shaped larvae chew dead rotting logs into tiny fragments. This increases surface area so fungi and bacteria (decomposers) break the wood down into mineral salts much faster!',
          id: 'Larvanya mengunyah batang kayu mati menjadi serpihan kecil. Ini memperluas luas permukaan sehingga jamur dan bakteri (pengurai) memecah kayu menjadi garam mineral jauh lebih cepat!',
        },
        anchor: [-0.2, 0.06, -0.02],
      },
      {
        id: 'spiny-legs',
        label: { en: 'Spiny Burrowing Legs', id: 'Kaki Berduri Penggali' },
        conceptTag: { en: 'Structural Adaptation', id: 'Adaptasi Struktural' },
        explanation: {
          en: 'Broad, toothed forelegs act like miniature shovels to tunnel swiftly beneath leaf litter and rotting logs, escaping heat and daytime predators.',
          id: 'Kaki depan yang lebar dan bergerigi bekerja seperti sekop mini untuk menggali cepat ke bawah serasah daun dan kayu lapuk, menghindari panas dan pemangsa siang hari.',
        },
        anchor: [0.22, 0.08, 0.22],
      },
    ],
    quiz: {
      question: {
        en: 'How do Rhinoceros Beetle larvae speed up the work of bacteria and fungi decomposing a fallen log?',
        id: 'Bagaimana larva Kumbang Badak mempercepat kerja bakteri dan jamur dalam menguraikan batang kayu tumbang?',
      },
      options: [
        { en: 'They perform photosynthesis inside the dark log to make glucose.', id: 'Mereka berfotosintesis di dalam kayu gelap untuk membuat glukosa.' },
        { en: 'They chew the dead wood into smaller pieces, increasing surface area for decomposers.', id: 'Mereka mengunyah kayu mati menjadi potongan kecil, memperluas luas permukaan bagi pengurai.' },
        { en: 'They seal the log completely so no oxygen or moisture can enter.', id: 'Mereka menutup rapat batang kayu agar oksigen dan air tidak masuk.' },
        { en: 'They turn mineral salts back into solid plastic.', id: 'Mereka mengubah garam mineral kembali menjadi plastik padat.' },
      ],
      correctIndex: 1,
      explanation: {
        en: 'Detritivores (like beetle grubs, earthworms, and millipedes) break dead organic matter into tiny pieces, increasing exposed surface area so microscopic decomposers (bacteria & fungi) recycle nutrients rapidly for plants.',
        id: 'Detritivora (seperti larva kumbang dan cacing tanah) memecah bahan organik mati menjadi potongan kecil, memperluas permukaan sehingga pengurai mikroskopis (bakteri & jamur) mendaur ulang nutrisi lebih cepat bagi tumbuhan.',
      },
      points: 100,
    },
  },

  {
    id: 'draco-flying-lizard',
    difficulty: 'hard',
    name: { en: 'Draco (Flying Lizard)', id: 'Cicak Terbang (Draco)' },
    scientificName: 'Draco sumatranus',
    group: 'Reptiles',
    groupLabel: { en: 'Reptile', id: 'Reptil' },
    syllabusFocus: {
      en: 'PSLE Reptile Features & Gliding Forces',
      id: 'PSLE Ciri Reptil & Gaya Meluncur',
    },
    habitat: {
      en: 'Tall Dipterocarp Tree Trunk',
      id: 'Batang Pohon Dipterokarpa Tinggi',
    },
    summary: {
      en: 'A cryptic bark-coloured agamid lizard of Bukit Timah that glides up to 20 metres between tall forest trunks.',
      id: 'Kadal berwarna kulit kayu kriptik di Bukit Timah yang mampu meluncur hingga 20 meter antarpohon tinggi.',
    },
    spawnXZ: [14.8, -11.5],
    perchHeight: 1.85,
    worldScale: 1.15,
    inspectDistance: 2.05,
    inspectTargetY: 0.16,
    initialYaw: -0.9,
    perchType: 'treeTrunk',
    hotspots: [
      {
        id: 'patagia',
        label: { en: 'Rib-Supported Wing Flaps (Patagia)', id: 'Selaput Sayap Tulang Rusuk (Patagia)' },
        conceptTag: { en: 'PSLE Forces · Air Resistance', id: 'Gaya PSLE · Hambatan Udara' },
        explanation: {
          en: 'Draco lizards do NOT flap like birds. They spread elongated ribs to unfold wide skin membranes (patagia), increasing exposed surface area and air resistance to glide safely down to another trunk!',
          id: 'Cicak terbang TIDAK mengepak seperti burung. Mereka membentangkan rusuk panjang untuk membuka selaput kulit lebar (patagia), memperbesar luas permukaan dan hambatan udara agar meluncur aman ke pohon lain!',
        },
        anchor: [0.36, 0.16, 0.0],
      },
      {
        id: 'dewlap',
        label: { en: 'Bright Yellow Throat Dewlap', id: 'Gelambir Leher Kuning Cerah' },
        conceptTag: { en: 'Behavioural · Signalling', id: 'Perilaku · Sinyal Teritori' },
        explanation: {
          en: 'While its back stays camouflaged against dappled bark, the male flashes a bright yellow throat flap (dewlap) to attract mates and warn rival males off his ant-hunting tree.',
          id: 'Sementara punggungnya berkamuflase di kulit kayu, pejantan mengibarkan gelambir leher kuning cerah untuk menarik pasangan dan memperingatkan pejantan saingan.',
        },
        anchor: [0, 0.02, 0.42],
      },
      {
        id: 'dry-scales',
        label: { en: 'Dry Scaly Reptile Skin', id: 'Kulit Bersisik Kering Reptil' },
        conceptTag: { en: 'Reptile Classification', id: 'Klasifikasi Reptil' },
        explanation: {
          en: 'Unlike amphibians, reptiles have dry, waterproof scaly skin that prevents water loss high up in the breezy sunlit canopy. They breathe solely through lungs and lay leathery-shelled eggs.',
          id: 'Berbeda dari amfibi, reptil memiliki kulit bersisik kering kedap air yang mencegah penguapan di tajuk pohon yang berangin. Mereka bernapas hanya dengan paru-paru dan bertelur bercangkang lentur.',
        },
        anchor: [0, 0.24, 0.08],
      },
      {
        id: 'deforestation',
        label: { en: 'Canopy Connectivity Need', id: 'Kebutuhan Keterhubungan Tajuk' },
        conceptTag: { en: 'PSLE Human Impact', id: 'Dampak Manusia PSLE' },
        explanation: {
          en: 'Because Draco lizards rarely descend to the dangerous forest floor, clearing wide roads through rainforests splits their canopy glide paths (habitat fragmentation), isolating populations.',
          id: 'Karena cicak terbang jarang turun ke lantai hutan yang berbahaya, pembukaan jalan lebar memutus jalur luncur antarpohon (fragmentasi habitat) dan mengisolasi populasinya.',
        },
        anchor: [0, 0.12, -0.58],
      },
    ],
    quiz: {
      question: {
        en: 'When a Draco lizard leaps off a tall tree and spreads its wide skin flaps (patagia), which scientific principle explains why it glides slowly instead of dropping straight down?',
        id: 'Saat cicak terbang Draco melompat dari pohon tinggi dan membentangkan selaput kulit lebarnya (patagia), prinsip ilmiah manakah yang menjelaskan mengapa ia meluncur perlahan alih-alih jatuh lurus ke bawah?',
      },
      options: [
        { en: 'Spreading the flaps removes the pull of gravity completely.', id: 'Membentangkan selaput menghilangkan gaya gravitasi sepenuhnya.' },
        { en: 'The larger exposed surface area increases upward air resistance opposing gravity.', id: 'Luas permukaan yang lebih besar meningkatkan hambatan udara ke atas yang melawan gravitasi.' },
        { en: 'The flaps make the lizard lighter by reducing its mass mid-air.', id: 'Selaput membuat cicak lebih ringan dengan mengurangi massanya di udara.' },
        { en: 'Magnetic attraction from the neighbouring tree pulls it sideways.', id: 'Gaya tarik magnet dari pohon sebelah menariknya ke samping.' },
      ],
      correctIndex: 1,
      explanation: {
        en: 'Gravity still acts downward with the same mass, but spreading the patagia dramatically increases exposed surface area, creating greater air resistance that slows the fall and enables controlled gliding.',
        id: 'Gravitasi tetap menarik ke bawah dengan massa yang sama, tetapi bentangan patagia memperbesar luas permukaan sehingga hambatan udara meningkat, memperlambat jatuh, dan memungkinkan luncuran terkendali.',
      },
      points: 100,
    },
  },

  {
    id: 'malayan-water-monitor',
    difficulty: 'hard',
    name: { en: 'Malayan Water Monitor', id: 'Biawak Air Malaya' },
    scientificName: 'Varanus salvator',
    group: 'Reptiles',
    groupLabel: { en: 'Reptile', id: 'Reptil' },
    syllabusFocus: {
      en: 'PSLE Apex Predator & Ecosystem Balance',
      id: 'PSLE Predator Puncak & Keseimbangan Ekosistem',
    },
    habitat: {
      en: 'Shaded Forest Stream Bank',
      id: 'Tepian Sungai Hutan yang Teduh',
    },
    summary: {
      en: 'A sleek semi-aquatic monitor lizard patrolling Singapore’s forest streams as both predator and clean-up scavenger.',
      id: 'Biawak semi-akuatik gesit yang berpatroli di sungai hutan Singapura sebagai predator sekaligus pemakan bangkai pembersih ekosistem.',
    },
    spawnXZ: [12.4, 8.6],
    perchHeight: 0.03,
    worldScale: 1.0,
    inspectDistance: 2.75,
    inspectTargetY: 0.28,
    initialYaw: -2.4,
    perchType: 'streamBank',
    hotspots: [
      {
        id: 'forked-tongue',
        label: { en: 'Forked Sensory Tongue', id: 'Lidah Bercabang Sensorik' },
        conceptTag: { en: 'Structural · Tracking Prey', id: 'Struktural · Melacak Mangsa' },
        explanation: {
          en: 'By flicking its forked tongue in the air, it collects scent particles from left and right simultaneously—telling it the exact direction of fish, frogs, crabs, or carrion.',
          id: 'Dengan menjulurkan lidah bercabangnya ke udara, ia menangkap partikel bau dari kiri dan kanan sekaligus—mengetahui arah pasti ikan, katak, kepiting, atau bangkai.',
        },
        anchor: [0, 0.28, 0.94],
      },
      {
        id: 'paddle-tail',
        label: { en: 'Laterally Flattened Tail', id: 'Ekor Pipih Menyamping' },
        conceptTag: { en: 'Structural · Streamlined Swimming', id: 'Struktural · Berenang Cepat' },
        explanation: {
          en: 'Its long tail is flattened from side to side like a kayak paddle! Sweeping it in S-curves propels the reptile silently through forest streams with minimal drag.',
          id: 'Ekor panjangnya pipih dari sisi ke sisi seperti dayung kayak! Kibasan berbentuk huruf S mendorong reptil ini melaju tenang di sungai hutan dengan hambatan minimal.',
        },
        anchor: [0, 0.22, -1.05],
      },
      {
        id: 'basking-scales',
        label: { en: 'Patterned Dry Scales & Basking', id: 'Sisik Kering Bercorak & Berjemur' },
        conceptTag: { en: 'Behavioural · Temperature Control', id: 'Perilaku · Pengatur Suhu' },
        explanation: {
          en: 'As a cold-blooded reptile, its body temperature changes with its surroundings. It basks in sunbeams along the stream bank to absorb heat energy before hunting.',
          id: 'Sebagai reptil berdarah dingin, suhu tubuhnya berubah mengikuti lingkungan. Ia berjemur di sinar matahari tepi sungai untuk menyerap energi panas sebelum berburu.',
        },
        anchor: [0, 0.34, 0.0],
      },
      {
        id: 'apex-scavenger',
        label: { en: 'Apex Predator & Scavenger', id: 'Predator Puncak & Pembersih' },
        conceptTag: { en: 'PSLE Ecosystem Inquiry', id: 'Inkuiri Ekosistem PSLE' },
        explanation: {
          en: 'Water monitors keep prey populations healthy and eat dead animals (scavenging), preventing disease spread. Polluted water or plastic litter in streams bioaccumulates up the food chain to harm them!',
          id: 'Biawak air menjaga populasi mangsa tetap seimbang dan memakan bangkai, mencegah penyebaran penyakit. Pencemaran air atau sampah plastik di sungai dapat menumpuk naik di rantai makanan dan membahayakannya!',
        },
        anchor: [0.3, 0.16, 0.32],
      },
    ],
    quiz: {
      question: {
        en: 'Why does plastic and chemical pollution in a forest stream pose a severe threat to a top predator like the Malayan Water Monitor?',
        id: 'Mengapa pencemaran plastik dan bahan kimia di sungai hutan menjadi ancaman serius bagi predator puncak seperti Biawak Air Malaya?',
      },
      options: [
        { en: 'Water monitors drink only rainwater from tree tops.', id: 'Biawak air hanya minum air hujan dari puncak pohon.' },
        { en: 'Toxins accumulate in fish and crabs, becoming concentrated in the top predator that eats many prey.', id: 'Racun menumpuk di tubuh ikan dan kepiting, lalu terkonsentrasi tinggi pada predator puncak yang memakan banyak mangsa.' },
        { en: 'Pollution causes the monitor’s dry scales to turn into feathers.', id: 'Polusi menyebabkan sisik kering biawak berubah menjadi bulu.' },
        { en: 'Water monitors cannot swim in freshwater streams.', id: 'Biawak air tidak dapat berenang di sungai air tawar.' },
      ],
      correctIndex: 1,
      explanation: {
        en: 'Harmful substances absorbed by smaller aquatic organisms (fish, crabs, frogs) pass up the food chain and build up in higher concentrations in apex predators like the Malayan Water Monitor.',
        id: 'Zat berbahaya yang diserap organisme air kecil (ikan, kepiting, katak) berpindah naik di rantai makanan dan menumpuk dalam konsentrasi lebih tinggi pada predator puncak seperti Biawak Air Malaya.',
      },
      points: 100,
    },
  },
];

export function getSpeciesByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): SpeciesData[] {
  return SPECIES_DATA.filter((s) => s.difficulty === difficulty);
}

export function getSpeciesById(id: string): SpeciesData | undefined {
  return SPECIES_DATA.find((s) => s.id === id);
}
