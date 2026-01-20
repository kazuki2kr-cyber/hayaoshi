
const { getSortedPostsData } = require('./src/lib/content');

try {
    console.log("Testing getSortedPostsData...");
    const posts = getSortedPostsData();
    console.log(`Success! Found ${posts.length} posts.`);
    posts.forEach(post => {
        console.log(`- ${post.metadata.title} (${post.slug})`);
    });
} catch (error) {
    console.error("Error:", error);
}
