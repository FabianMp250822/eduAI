# **App Name**: EduSync AI

## Core Features:

- Offline Content Access: Enable students to access pre-synced educational content (text, videos, images, PDFs, audios, interactive elements) without an internet connection. This requires implementing a local database (IndexedDB recommended for structured data) and Service Workers for caching large multimedia files.
- Synchronization: The app should synchronize the latest content from Firebase Firestore with the local database upon online startup. Users must be able to explicitly mark subjects/topics for offline download. Any progress or gamification data generated offline must sync with Firebase when connectivity is restored.
- Connectivity Management: The UI should clearly indicate online/offline status and adapt the user experience accordingly.
- License Validation: Implement a one-time license validation upon initial installation/first launch. This validation will be performed against Firebase.
- Installation Control: Each license will be associated with a maximum number of installations/activations. Upon first use on a new device, the license will be registered in Firebase, decrementing its available installation count. If the limit is exceeded, the license will be rejected.
- No Traditional Login: Post-validation, the app will not require traditional user login (username/password). Firebase anonymous authentication (`signInAnonymously`) will be used, with the resulting `userId` internally linked to the validated license to track user progress and gamification data.
- User Experience: Valid licenses grant access; invalid licenses prevent access and inform the user.
- Curriculum Structure: Provide a hierarchical content structure:Grades: Preschool, First, Second, ..., Eleventh. Subjects: Mathematics, Language, Natural Sciences, Social Sciences, English, etc., for each grade. Topics: Multiple topics within each subject (e.g., "Algebra," "The Cell," "History of Colombia"). Specific Content: Each topic can include text articles, video links (YouTube embeds or Firebase Storage hosted), images, downloadable PDFs, audio explanations, and simple interactive content (e.g., basic quizzes, drag-and-drop).
- Intuitive Interface: Implement clear and visual navigation between grades, subjects, and topics. Each subject and topic should feature a representative image for enhanced intuition and visual appeal. The design should be clean and user-friendly for all age groups.
- Progress Tracking: Students should earn points or observe progress upon completing topics or interactive activities.
- Visual Progress: Progress should be visually represented (e.g., progress bars, badges, accumulated points).
- Data Storage: Gamification data must be stored in Firebase Firestore, associated with the user's anonymous `userId`, and capable of local saving for offline use with subsequent syncing.
- AI Content Generation: Integrate Gemini AI (using `gemini-2.0-flash` for text, `imagen-3.0-generate-002` for images if needed) to generate current educational content. This will be an "Ask the AI" section where students can query the AI on any subject or topic from preschool to eleventh grade, receiving relevant curriculum-aligned information. The Gemini API Key will be provided by the Canvas environment.

## Style Guidelines:

- A clean, grid-based layout to ensure content is well-organized and easy to navigate, suitable for users of all ages.
- Implement a UI option for users to select from predefined color palettes.
- Headline font: 'Space Grotesk' sans-serif for headlines and shorter text blocks; its modern techy look suits educational materials while remaining readable.
- Body font: 'Inter' sans-serif for long passages of text; its objective and neutral aesthetic will provide a comfortable and sustained reading experience.
- Consistent and clear icons to represent different subjects and topics; use a flat design style for simplicity and quick recognition.