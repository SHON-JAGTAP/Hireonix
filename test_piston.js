async function testPiston() {
  const payload = {
    language: 'java',
    version: '*',
    files: [{ content: `public class Solution {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}` }]
  };
  
  try {
    const response = await fetch('http://localhost:2000/api/v2/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(err);
  }
}

testPiston();
