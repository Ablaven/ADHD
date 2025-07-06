const doctors = [
    {
        id: 1,
        name: "Dr. Sarah Mitchell",
        specialty: "Child Psychiatrist",
        image: "./Images/65853cb72d33d.jpg",
        rating: 4.5,
        experience: "15+ years",
        status: "online",
        specializations: ["ADHD", "Anxiety", "Child Development"]
    },
    {
        id: 2,
        name: "Dr. James Wilson",
        specialty: "Neurologist",
        image: "./Images/doctor2.jpg",
        rating: 5.0,
        experience: "12+ years",
        status: "online",
        specializations: ["ADHD", "Neurology", "Brain Development"]
    },
    {
        id: 3,
        name: "Dr. Maria Rodriguez",
        specialty: "Adult Psychiatrist",
        image: "./Images/doctor3.jpg",
        rating: 4.0,
        experience: "10+ years",
        status: "busy",
        specializations: ["ADHD", "Depression", "Adult Therapy"]
    },
    {
        id: 4,
        name: "Dr. Michael Chang",
        specialty: "Child Psychologist",
        image: "./Images/doctor4.jpg",
        rating: 4.8,
        experience: "8+ years",
        status: "online",
        specializations: ["ADHD", "Behavioral Therapy", "Learning Disabilities"]
    },
    {
        id: 5,
        name: "Dr. Emily Thompson",
        specialty: "Neuropsychiatrist",
        image: "./Images/doctor5.jpg",
        rating: 4.7,
        experience: "14+ years",
        status: "busy",
        specializations: ["ADHD", "Neurological Disorders", "Medication Management"]
    },
    {
        id: 6,
        name: "Dr. David Anderson",
        specialty: "Adult Psychiatrist",
        image: "./Images/doctor6.jpg",
        rating: 4.9,
        experience: "20+ years",
        status: "online",
        specializations: ["ADHD", "Anxiety", "Depression"]
    },
    {
        id: 7,
        name: "Dr. Lisa Chen",
        specialty: "Child Psychiatrist",
        image: "./Images/doctor7.jpg",
        rating: 4.6,
        experience: "11+ years",
        status: "online",
        specializations: ["ADHD", "Child Psychology", "Family Therapy"]
    },
    {
        id: 8,
        name: "Dr. Robert Martinez",
        specialty: "Psychologist",
        image: "./Images/doctor8.jpg",
        rating: 4.4,
        experience: "9+ years",
        status: "busy",
        specializations: ["ADHD", "Cognitive Behavioral Therapy", "Stress Management"]
    },
    {
        id: 9,
        name: "Dr. Amanda White",
        specialty: "Neurologist",
        image: "./Images/doctor9.jpg",
        rating: 4.8,
        experience: "13+ years",
        status: "online",
        specializations: ["ADHD", "Neurodevelopmental Disorders", "Research"]
    },
    {
        id: 10,
        name: "Dr. John Peterson",
        specialty: "Adult Psychiatrist",
        image: "./Images/doctor10.jpg",
        rating: 4.3,
        experience: "7+ years",
        status: "online",
        specializations: ["ADHD", "Mood Disorders", "Adult Therapy"]
    },
    {
        id: 11,
        name: "Dr. Rachel Kim",
        specialty: "Child Psychologist",
        image: "./Images/doctor11.jpg",
        rating: 4.7,
        experience: "10+ years",
        status: "busy",
        specializations: ["ADHD", "Early Intervention", "Educational Psychology"]
    },
    {
        id: 12,
        name: "Dr. Thomas Brown",
        specialty: "Neuropsychiatrist",
        image: "./Images/doctor12.jpg",
        rating: 4.9,
        experience: "16+ years",
        status: "online",
        specializations: ["ADHD", "Complex Cases", "Research"]
    },
    {
        id: 13,
        name: "Dr. Sofia Garcia",
        specialty: "Child Psychiatrist",
        image: "./Images/doctor13.jpg",
        rating: 4.5,
        experience: "12+ years",
        status: "online",
        specializations: ["ADHD", "Child Development", "Family Counseling"]
    },
    {
        id: 14,
        name: "Dr. William Taylor",
        specialty: "Adult Psychologist",
        image: "./Images/doctor14.jpg",
        rating: 4.6,
        experience: "11+ years",
        status: "busy",
        specializations: ["ADHD", "Career Counseling", "Adult Therapy"]
    },
    {
        id: 15,
        name: "Dr. Jennifer Lee",
        specialty: "Neurologist",
        image: "./Images/doctor15.jpg",
        rating: 4.8,
        experience: "14+ years",
        status: "online",
        specializations: ["ADHD", "Neurological Assessment", "Treatment Planning"]
    },
    {
        id: 16,
        name: "Dr. Christopher Davis",
        specialty: "Child Psychiatrist",
        image: "./Images/doctor16.jpg",
        rating: 4.7,
        experience: "13+ years",
        status: "online",
        specializations: ["ADHD", "Behavioral Disorders", "Child Psychology"]
    },
    {
        id: 17,
        name: "Dr. Michelle Wong",
        specialty: "Adult Psychiatrist",
        image: "./Images/doctor17.jpg",
        rating: 4.4,
        experience: "8+ years",
        status: "busy",
        specializations: ["ADHD", "Adult Mental Health", "Medication Management"]
    },
    {
        id: 18,
        name: "Dr. Daniel Miller",
        specialty: "Psychologist",
        image: "./Images/doctor18.jpg",
        rating: 4.9,
        experience: "15+ years",
        status: "online",
        specializations: ["ADHD", "Psychological Assessment", "Therapy"]
    },
    {
        id: 19,
        name: "Dr. Elizabeth Clark",
        specialty: "Child Psychologist",
        image: "./Images/doctor19.jpg",
        rating: 4.6,
        experience: "10+ years",
        status: "online",
        specializations: ["ADHD", "Learning Support", "Child Development"]
    },
    {
        id: 20,
        name: "Dr. Richard Turner",
        specialty: "Neuropsychiatrist",
        image: "./Images/doctor20.jpg",
        rating: 4.8,
        experience: "17+ years",
        status: "busy",
        specializations: ["ADHD", "Complex Disorders", "Research"]
    },
    {
        id: 21,
        name: "Dr. Patricia Martinez",
        specialty: "Child Psychiatrist",
        image: "./Images/doctor21.jpg",
        rating: 4.7,
        experience: "12+ years",
        status: "online",
        specializations: ["ADHD", "Child Therapy", "Family Support"]
    },
    {
        id: 22,
        name: "Dr. Kevin Zhang",
        specialty: "Adult Psychologist",
        image: "./Images/doctor22.jpg",
        rating: 4.5,
        experience: "9+ years",
        status: "online",
        specializations: ["ADHD", "Adult Counseling", "Career Development"]
    },
    {
        id: 23,
        name: "Dr. Laura Anderson",
        specialty: "Neurologist",
        image: "./Images/doctor23.jpg",
        rating: 4.9,
        experience: "16+ years",
        status: "busy",
        specializations: ["ADHD", "Neurological Research", "Treatment"]
    },
    {
        id: 24,
        name: "Dr. Steven Johnson",
        specialty: "Child Psychiatrist",
        image: "./Images/doctor24.jpg",
        rating: 4.6,
        experience: "11+ years",
        status: "online",
        specializations: ["ADHD", "Child Mental Health", "Family Therapy"]
    },
    {
        id: 25,
        name: "Dr. Karen Wilson",
        specialty: "Adult Psychiatrist",
        image: "./Images/doctor25.jpg",
        rating: 4.7,
        experience: "13+ years",
        status: "online",
        specializations: ["ADHD", "Adult Mental Health", "Therapy"]
    },
    {
        id: 26,
        name: "Dr. George Thompson",
        specialty: "Psychologist",
        image: "./Images/doctor26.jpg",
        rating: 4.8,
        experience: "14+ years",
        status: "busy",
        specializations: ["ADHD", "Psychological Assessment", "Counseling"]
    },
    {
        id: 27,
        name: "Dr. Nancy Lee",
        specialty: "Child Psychologist",
        image: "./Images/doctor27.jpg",
        rating: 4.5,
        experience: "10+ years",
        status: "online",
        specializations: ["ADHD", "Child Development", "Educational Support"]
    },
    {
        id: 28,
        name: "Dr. Paul Roberts",
        specialty: "Neuropsychiatrist",
        image: "./Images/doctor28.jpg",
        rating: 4.9,
        experience: "18+ years",
        status: "online",
        specializations: ["ADHD", "Neuropsychiatry", "Research"]
    },
    {
        id: 29,
        name: "Dr. Sandra Kim",
        specialty: "Adult Psychiatrist",
        image: "./Images/doctor29.jpg",
        rating: 4.6,
        experience: "12+ years",
        status: "busy",
        specializations: ["ADHD", "Adult Therapy", "Mental Health"]
    },
    {
        id: 30,
        name: "Dr. Mark Davis",
        specialty: "Child Psychiatrist",
        image: "./Images/doctor30.jpg",
        rating: 4.7,
        experience: "13+ years",
        status: "online",
        specializations: ["ADHD", "Child Psychology", "Family Support"]
    }
]; 