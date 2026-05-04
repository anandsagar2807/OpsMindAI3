import fetch from 'node-fetch';

const API_URL = 'http://127.0.0.1:5000/api';

const testQueries = [
  {
    name: 'Refund Policy Test',
    query: 'How do I process a refund?',
    expectedKeywords: ['refund', 'process', 'payment']
  },
  {
    name: 'Leave Policy Test',
    query: 'How do I request leave?',
    expectedKeywords: ['leave', 'request', 'approval']
  },
  {
    name: 'Escalation Matrix Test',
    query: 'What is the escalation matrix?',
    expectedKeywords: ['escalation', 'manager', 'process']
  },
  {
    name: 'Security Guidelines Test',
    query: 'What are the security guidelines?',
    expectedKeywords: ['security', 'password', 'access']
  },
  {
    name: 'Irrelevant Query Test (Should Fail)',
    query: 'What is the weather today?',
    expectedKeywords: [],
    shouldFail: true
  }
];

async function testSearchAPI(token) {
  console.log('🧪 Starting Search API Tests\n');
  console.log('='.repeat(60));

  for (const test of testQueries) {
    console.log(`\n📝 Test: ${test.name}`);
    console.log(`Query: "${test.query}"`);
    console.log('-'.repeat(60));

    try {
      const response = await fetch(`${API_URL}/chat/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ query: test.query })
      });

      const data = await response.json();

      if (!response.ok) {
        console.log(`❌ HTTP Error: ${response.status}`);
        console.log(`Message: ${data.message}`);
        continue;
      }

      console.log(`✅ Success: ${data.success}`);
      console.log(`Message: ${data.message}`);

      if (data.data && data.data.results) {
        console.log(`\n📊 Results: ${data.data.results.length} chunks found`);

        data.data.results.forEach((result, idx) => {
          console.log(`\n  Result ${idx + 1}:`);
          console.log(`  - Document: ${result.documentName}`);
          console.log(`  - Page: ${result.pageNumber}`);
          console.log(`  - Score: ${(result.score * 100).toFixed(1)}%`);
          console.log(`  - Text Preview: ${result.text.substring(0, 100)}...`);
        });

        if (data.data.metadata) {
          console.log(`\n📈 Metadata:`);
          console.log(`  - Documents Searched: ${data.data.metadata.documentsSearched}`);
          console.log(`  - Avg Similarity: ${(data.data.metadata.avgSimilarity * 100).toFixed(1)}%`);
          console.log(`  - Max Similarity: ${(data.data.metadata.maxSimilarity * 100).toFixed(1)}%`);
          console.log(`  - Min Similarity: ${(data.data.metadata.minSimilarity * 100).toFixed(1)}%`);
        }

        if (data.data.context) {
          console.log(`\n🔧 Context Window:`);
          console.log(`  - Chunks Used: ${data.data.context.chunksUsed}`);
          console.log(`  - Total Tokens: ${data.data.context.totalTokens}`);
        }

        if (test.shouldFail) {
          console.log(`\n⚠️  Expected to fail but got results`);
        } else {
          console.log(`\n✅ Test Passed`);
        }
      } else {
        if (test.shouldFail) {
          console.log(`\n✅ Test Passed (Expected failure)`);
        } else {
          console.log(`\n❌ No results found (unexpected)`);
        }
      }

    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }

    console.log('='.repeat(60));
  }

  console.log('\n✅ All tests completed!\n');
}

async function testChatAPI(token) {
  console.log('\n🤖 Testing Chat API\n');
  console.log('='.repeat(60));

  const query = 'What is our refund policy?';
  console.log(`Query: "${query}"`);

  try {
    const response = await fetch(`${API_URL}/chat/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ query })
    });

    const data = await response.json();

    if (!response.ok) {
      console.log(`❌ HTTP Error: ${response.status}`);
      console.log(`Message: ${data.message}`);
      return;
    }

    console.log(`\n✅ Response:`);
    console.log(data.data.response);

    if (data.data.sources && data.data.sources.length > 0) {
      console.log(`\n📚 Sources (${data.data.sources.length}):`);
      data.data.sources.forEach((source, idx) => {
        console.log(`  ${idx + 1}. ${source.filename} - Page ${source.pageNumber} (${(source.similarity * 100).toFixed(1)}%)`);
      });
    }

  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }

  console.log('='.repeat(60));
}

const token = process.argv[2];

if (!token) {
  console.log('❌ Please provide a Clerk token as argument');
  console.log('Usage: node test-search-api.js YOUR_CLERK_TOKEN');
  process.exit(1);
}

(async () => {
  await testSearchAPI(token);
  await testChatAPI(token);
})();
