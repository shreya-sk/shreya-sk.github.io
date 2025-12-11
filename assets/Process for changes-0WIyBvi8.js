const e=`# Implementation Plan for Fine-grained Emotion Detection and Counterfactual Suggestions

## Overview

We'll extend the current ABSA system to include fine-grained emotion detection beyond basic sentiment polarity and add counterfactual suggestions for negative aspects. These additions will require targeted modifications to several existing components rather than a complete architectural overhaul.

## 1. Fine-grained Emotion Detection

### Files to Modify:

1. **src/models/classifier.py** (AspectOpinionJointClassifier)
    
    - Expand sentiment classification to include emotion detection
    - Add emotion-specific lexicons and rules
2. **src/models/absa.py** (LLMABSA)
    
    - Update the extract_triplets method to include emotion information
    - Modify triplet data structure to include emotion field
3. **src/inference/predictor.py** (LLMABSAPredictor)
    
    - Update visualization methods to display emotion information
    - Add emotion-specific confidence thresholds
4. **src/models/explanation_generator.py** (ExplanationGenerator)
    
    - Add emotion-specific templates for explanation generation
    - Enhance explanation methods to incorporate emotion information

### New Methods/Classes to Add:

1. In **AspectOpinionJointClassifier**:
    
    - Add \`_detect_emotions(self, hidden_states, aspect_weights, opinion_weights, sentiment_logits)\` method
    - Add emotion lexicons as class variables (joy, anger, surprise, disappointment, satisfaction, frustration)
    - Modify forward method to return emotion scores
2. In **LLMABSA**:
    
    - Update forward method to include emotion detection
    - Modify extract_triplets to include emotion information in triplet dictionaries
3. In **ExplanationGenerator**:
    
    - Add emotion-specific templates dictionary
    - Add \`_generate_emotion_explanation(self, triplet)\` method

## 2. Counterfactual Suggestions

### Files to Modify:

1. **src/models/explanation_generator.py** (ExplanationGenerator)
    
    - Add counterfactual suggestion generation for negative aspects
2. **src/inference/predictor.py** (LLMABSAPredictor)
    
    - Update visualization to display suggestions
    - Add option to include/exclude suggestions

### New Files to Create:

1. **src/models/suggestion_generator.py**
    - Create new SuggestionGenerator class for generating counterfactual improvements

### New Methods/Classes to Add:

1. New **SuggestionGenerator** class:
    
    - \`__init__(self)\` with domain-specific suggestion templates
    - \`generate_suggestion(self, aspect, opinion, emotion)\` method to create suggestions
    - \`map_opinion_to_suggestion(self, opinion, aspect_type)\` method for opinion-based suggestions
2. In **ExplanationGenerator**:
    
    - Add \`_generate_suggestion(self, triplet)\` method
    - Update \`_generate_single_explanation\` and other explanation methods to include suggestions
    - Add suggestion templates dictionary

## Detailed Implementation Steps

### Step 1: Implement Fine-grained Emotion Detection

1. **Update AspectOpinionJointClassifier**:
    
    - Expand the classifier output layer from 3 classes (POS/NEU/NEG) to include emotions (8-10 total)
    - Create emotion lexicons for common emotions in reviews (joy, satisfaction, disappointment, frustration, etc.)
    - Add emotion detection logic using opinion terms and contextual cues
    - Modify confidence estimation to include emotion confidence
2. **Update ABSA Model**:
    
    - Integrate emotion detection into main model pipeline
    - Update triplet data structure to include emotion field alongside sentiment
    - Ensure backward compatibility with existing code that expects only sentiment
3. **Update Explanation Generator**:
    
    - Create emotion-specific templates for each emotion category
    - Update explanation generation logic to incorporate emotion information
    - Ensure graceful fallback to sentiment-based templates when emotion confidence is low

### Step 2: Implement Counterfactual Suggestions

1. **Create SuggestionGenerator**:
    
    - Implement domain-specific rules for suggestion generation
    - Create mappings from negative opinions to potential improvements
    - Add aspect categorization to provide appropriate suggestions based on aspect type
2. **Integrate with ExplanationGenerator**:
    
    - Add suggestion templates to existing explanation templates
    - Modify combination logic to incorporate suggestions for negative aspects
    - Ensure suggestions are included only when appropriate
3. **Update Predictor Visualization**:
    
    - Add suggestion display to HTML visualization
    - Color-code emotions and suggestions for better user experience
    - Add summary section for most important suggestions

### Step 3: Update Training and Evaluation

1. **Update evaluation.py**:
    
    - Add metrics for emotion detection accuracy
    - Add evaluation of suggestion quality
    - Implement emotion-specific precision/recall/F1
2. **Update data preprocessing**:
    
    - Add emotion annotations to training data if available
    - Create synthetic emotion labels based on sentiment and opinion terms if needed

This implementation plan focuses on extending the existing architecture without requiring major structural changes, while still providing substantial new capabilities that advance the state of ABSA research.`;export{e as default};
