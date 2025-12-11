const e=`
## 📊 **STANDARD PUBLICATION EXPERIMENTAL WORKFLOW**

### **Step 1: Baseline Single-Domain Training** 
\`\`\`bash
# Train each dataset individually - these are your BASELINES
python train.py --config research --dataset rest14 --num_epochs 25 --output_dir experiments/baselines/rest14
python train.py --config research --dataset rest15 --num_epochs 25 --output_dir experiments/baselines/rest15
python train.py --config research --dataset rest16 --num_epochs 25 --output_dir experiments/baselines/rest16
python train.py --config research --dataset laptop14 --num_epochs 25 --output_dir experiments/baselines/laptop14
\`\`\`

**Result**: Table 1 in your paper - "Single Domain Performance"

### **Step 2: Cross-Domain Transfer** (Your Main Contribution)

\`\`\`bash
# Take model trained on source, evaluate on target data
# DON'T retrain - just evaluate existing models on different test sets

# Most important pairs for your paper:
python test.py --model_path experiments/baselines/rest14/best_model.pt --dataset laptop14 --output_dir results/rest14_to_laptop14
python test.py --model_path experiments/baselines/laptop14/best_model.pt --dataset rest14 --output_dir results/laptop14_to_rest14
python test.py --model_path experiments/baselines/rest15/best_model.pt --dataset rest16 --output_dir results/rest15_to_rest16
python test.py --model_path experiments/baselines/rest16/best_model.pt --dataset rest15 --output_dir results/rest16_to_rest15
\`\`\`

**Result**: Table 2 - "Cross-Domain Transfer Performance"

### **Step 3: Ablation Studies** (Prove Each Component Helps)

\`\`\`bash
# Train variants with components disabled - only need 2-3 key configurations
# Use most challenging pair: rest14 → laptop14

# Full model (already have from Step 1)
# experiments/baselines/rest14/best_model.pt ✅

# Without gradient reversal
python train.py --config research --dataset rest14 --use_gradient_reversal false --num_epochs 25 --output_dir experiments/ablation/no_gradient_reversal

# Without implicit detection  
python train.py --config research --dataset rest14 --use_implicit_detection false --num_epochs 25 --output_dir experiments/ablation/no_implicit_detection

# Minimal baseline (no advanced features)
python train.py --config baseline --dataset rest14 --num_epochs 25 --output_dir experiments/ablation/minimal_baseline
\`\`\`

**Result**: Table 3 - "Ablation Study Results"

## 📋 **WHAT PAPERS ACTUALLY REPORT**

### **Main Results Table (Example)**

|Source → Target|Baseline F1|GRADIENT F1|Improvement|
|---|---|---|---|
|Rest14 → Laptop14|64.2|72.8|**+8.6**|
|Laptop14 → Rest14|68.1|75.3|**+7.2**|
|Rest15 → Rest16|71.4|78.9|**+7.5**|
|Rest16 → Rest15|70.8|77.6|**+6.8**|
|**Average**|**68.6**|**76.2**|**+7.6**|

### **Ablation Study Table**

|Configuration|Triplet F1|Δ F1|
|---|---|---|
|GRADIENT (Full)|72.8|-|
|- Gradient Reversal|67.3|-5.5|
|- Implicit Detection|69.1|-3.7|
|- Both|64.2|-8.6|

## 🎯 **EFFICIENT EXPERIMENT STRATEGY**

### **Priority Order** (Do These First):

1. **Single domain baselines** (4 models) - **Essential**
2. **Key cross-domain pairs** (4-6 evaluations) - **Essential**
3. **Ablation studies** (3-4 models) - **Essential**

### **Optional Extensions** (If You Have Time):

4. Few-shot experiments (10, 50, 100 examples)
5. Additional cross-domain pairs
6. Error analysis on failure cases

## 📝 **TYPICAL PAPER EXPERIMENT SECTION**

\`\`\`markdown
## 5. Experiments

### 5.1 Experimental Setup
- **Datasets**: Restaurant14/15/16, Laptop14
- **Baselines**: BERT-PT, GRACE, BMRC (from literature)
- **Metrics**: F1-score for aspects, opinions, sentiments, triplets
- **Implementation**: PyTorch, 3 random seeds, statistical significance testing

### 5.2 Main Results
Our GRADIENT model achieves substantial improvements over single-domain baselines:
- **Average cross-domain improvement**: +7.6 F1 points
- **Best transfer**: Rest14→Laptop14 (+8.6 F1)
- **Consistent gains**: All domain pairs show positive transfer

### 5.3 Ablation Studies  
We systematically remove components to assess their contribution:
- **Gradient Reversal**: Contributes +5.5 F1 points
- **Implicit Detection**: Contributes +3.7 F1 points
- **Combined effect**: +8.6 F1 points total improvement
\`\`\`

## ⏰ **REALISTIC TIMELINE**

### **Week 1**: Core Experiments

- **Days 1-2**: Single domain training (4 models)
- **Days 3-4**: Cross-domain evaluation (6-8 tests)
- **Days 5-7**: Ablation studies (3-4 models)

### **Week 2**: Analysis & Writing

- **Days 1-2**: Results analysis, statistical tests
- **Days 3-5**: Paper writing (experiments section)
- **Days 6-7**: Tables, figures, polish

## 🎯 **YOUR IMMEDIATE NEXT STEPS**

1. **Continue with single domain training** (finish all 4 datasets)
2. **Use existing trained models for cross-domain evaluation**
3. **Train only 3-4 ablation variants** (not full matrix)
4. **Focus on paper writing** alongside experiments

`;export{e as default};
