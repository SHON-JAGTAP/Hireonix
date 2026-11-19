import React from 'react'
import MainLayout from '../components/MainLayout'
import { Mail, Phone, MessageSquare, BookOpen } from 'lucide-react'

const Help = () => {
  const faqs = [
    { 
      q: 'How do I reset my password?',
      a: 'Click on "Forgot Password" on the login page and follow the instructions sent to your email.'
    },
    { 
      q: 'How are my test scores calculated?',
      a: 'Scores are calculated based on correct answers, time taken, and difficulty level of questions.'
    },
    { 
      q: 'Can I retake tests?',
      a: 'Yes, you can retake any test. Your best score will be saved.'
    },
    { 
      q: 'How do I download my resume?',
      a: 'Go to Resume Analyzer, make sure all details are filled, and click the Download button.'
    },
  ]

  return (
    <MainLayout>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Help & Support</h1>
        
        {/* Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <Mail className="mx-auto text-blue-500 mb-4" size={32} />
            <h3 className="font-bold text-gray-900 mb-2">Email Us</h3>
            <p className="text-gray-600">support@placementhub.com</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <Phone className="mx-auto text-green-500 mb-4" size={32} />
            <h3 className="font-bold text-gray-900 mb-2">Call Us</h3>
            <p className="text-gray-600">+91 98765 43210</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <MessageSquare className="mx-auto text-purple-500 mb-4" size={32} />
            <h3 className="font-bold text-gray-900 mb-2">Live Chat</h3>
            <p className="text-gray-600">Available 9AM - 6PM</p>
          </div>
        </div>

        {/* FAQs */}
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <BookOpen size={28} />
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <details key={idx} className="border rounded-lg p-4">
                <summary className="font-semibold text-gray-900 cursor-pointer">
                  {faq.q}
                </summary>
                <p className="text-gray-600 mt-4 pl-4">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default Help
