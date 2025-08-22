# 🔥 Roastify - AI-Powered Comedy Roast Generator

A comprehensive prompt engineering project demonstrating advanced AI techniques through witty, good-natured roasts. Built with Google Gemini and featuring multiple prompting strategies, parameter tuning, and detailed evaluation metrics.

---

## 🚀 Project Overview

Roastify is an AI comedy generator that showcases various prompt engineering techniques through the lens of generating creative, playful roasts. The project implements multiple prompting strategies and demonstrates their effectiveness through systematic evaluation.

**Key Features:**
- 🎯 Multiple prompt engineering techniques (Zero-shot, One-shot, Multi-shot, Dynamic, etc.)
- 🎛️ Parameter tuning (Temperature, Top P)
- 📊 Comprehensive evaluation metrics (Correctness, Efficiency, Scalability)
- 🏗️ Structured output with validation
- 🛡️ Safety controls and content filtering
- 📈 Performance monitoring and analysis

---

## 🛠️ Tech Stack

- **AI Model**: Google Gemini 2.5 Flash
- **Runtime**: Node.js
- **Prompt Engineering**: Custom prompt builders with RTFC framework
- **Evaluation**: Custom metrics and validation systems
- **Safety**: Built-in content filtering and constraints

---

## 📁 Project Structure

```
S72_HerambInamke_Roastify_GenAI/
├── index.js                 # Main application entry point
├── package.json             # Dependencies and scripts
├── src/
│   ├── config/
│   │   └── gemini.js        # Gemini AI configuration
│   ├── prompts/             # Prompt engineering modules
│   │   ├── zeroShot.js      # Zero-shot prompting
│   │   ├── oneShot.js       # One-shot prompting
│   │   ├── multiShot.js     # Multi-shot prompting
│   │   ├── dynamicPrompt.js # Dynamic prompt assembly
│   │   ├── structured.js    # Structured output prompting
│   │   ├── systemUser.js    # System/User prompts with RTFC
│   │   ├── stopSequence.js  # Stop sequence control
│   │   ├── temperature.js   # Temperature parameter tuning
│   │   └── topP.js         # Top P nucleus sampling
│   └── utils/
│       ├── logger.js        # Logging utilities
│       └── metrics.js       # Performance and evaluation metrics
└── tests/                   # Test files (if any)
```

---

## 🎯 Prompt Engineering Techniques Implemented

### 1. **Zero-Shot Prompting**
Basic prompting without examples, relying on the model's inherent knowledge.

### 2. **One-Shot Prompting**
Single example to guide the AI's response style and format.

### 3. **Multi-Shot Prompting**
Multiple examples to establish consistent patterns and improve output quality.

### 4. **Dynamic Prompting**
Runtime assembly of prompts from modular components (persona, task, constraints, examples).

### 5. **Structured Output**
JSON-formatted responses with validation and schema enforcement.

### 6. **System & User Prompts (RTFC Framework)**
- **R**ole: Define AI identity and capabilities
- **T**ask: Specify objectives and requirements
- **F**ormat: Structure response expectations
- **C**ontext: Provide environmental constraints and guidelines

### 7. **Stop Sequences**
Control response termination with specific tokens.

### 8. **Temperature Control**
Parameter tuning for creativity vs. consistency balance.

### 9. **Top P (Nucleus Sampling)**
Quality-focused diversity control through probability distribution limiting.

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- Google Gemini API key

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd S72_HerambInamke_Roastify_GenAI
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment setup:**
   Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the application:**
   ```bash
   npm start
   # or
   node index.js
   ```

---

## 🎮 Usage Examples

The application runs all prompt engineering techniques sequentially and displays:

### Sample Output:
```
[INFO]: Running zero-shot prompt...
[SUCCESS]: Zero-Shot Prompt Output:
Your productivity is like a browser with 47 tabs open—lots of potential, zero focus.

[INFO]: Evaluation -> Correctness: likely valid (Non-empty natural language output); Efficiency: 1247 ms; Scalability(meta): tokens prompt=23, gen=18, total=41

[INFO]: Running dynamic prompting...
[SUCCESS]: Dynamic Prompt Output:
Your coffee addiction is a subscription service nobody asked for—endless charges, questionable benefits.

...and so on for all techniques
```

### Key Metrics Displayed:
- **Correctness**: Response validation and quality assessment
- **Efficiency**: Response generation time in milliseconds
- **Scalability**: Token usage for capacity planning

---

## 📊 Evaluation Criteria

### 1. **Correctness**
- Content appropriateness and safety
- Response relevance to input
- Format compliance (for structured outputs)
- RTFC framework adherence

### 2. **Efficiency**
- Response generation speed
- API call optimization
- Resource utilization

### 3. **Scalability**
- Token usage monitoring
- Concurrent request handling capability
- Performance under load

---

## 🛡️ Safety Features

- **Content Filtering**: No hate speech, slurs, or explicit content
- **Tone Control**: Maintains playful, non-abusive atmosphere
- **Length Limits**: Prevents overly long or inappropriate responses
- **Validation**: Multiple layers of output checking

---

## 🎨 Customization

### Adding New Prompt Types
1. Create a new file in `src/prompts/`
2. Export prompt builder function
3. Add validation logic
4. Import and integrate in `index.js`

### Modifying Parameters
- Temperature: 0.1 (consistent) to 0.9 (creative)
- Top P: 0.1 (focused) to 0.9 (diverse)
- Stop sequences: Custom termination tokens

### Example Custom Prompt:
```javascript
export function buildCustomPrompt({
  subject = "default subject",
  style = "witty",
  constraints = ["be respectful", "keep it short"]
} = {}) {
  return `You are a ${style} AI. Roast: ${subject}. Rules: ${constraints.join(', ')}`;
}
```

---

## 📈 Performance Monitoring

The application tracks:
- Response times for each technique
- Token usage patterns
- Success/failure rates
- Quality metrics (when applicable)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Implement your changes
4. Add appropriate tests
5. Submit a pull request

---

## 📄 License

This project is part of an educational assignment demonstrating prompt engineering techniques and AI interaction patterns.

---

## 🎯 Learning Objectives Achieved

- ✅ **Dynamic Prompting**: Runtime prompt assembly from modular components
- ✅ **Multi-shot Prompting**: Multiple examples for consistent output patterns
- ✅ **One-shot Prompting**: Single example guidance for style establishment
- ✅ **Stop Sequences**: Response termination control
- ✅ **Structured Output**: JSON formatting with validation
- ✅ **System & User Prompts**: RTFC framework implementation
- ✅ **Temperature Control**: Creativity vs. consistency parameter tuning
- ✅ **Top P Sampling**: Quality-focused diversity control

---

## 📞 Contact

For questions about this project or prompt engineering techniques, please refer to the code documentation and comments within each module.

---

*Built with ❤️ and a sense of humor. Remember: It's all in good fun!*