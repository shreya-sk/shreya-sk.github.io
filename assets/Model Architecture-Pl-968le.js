const n=`\`\`\`mermaid
graph TB
    subgraph "Input"
        I[Text Input] --> Tok[Tokenization]
    end

    subgraph "Encoder Layer"
        Tok --> TL[TinyLlama Encoder]
        TL --> Emb[Contextual Embeddings]
    end

    subgraph "Span Detection Layer"
        Emb --> BiL[BiLSTM Encoder]
        BiL --> AspH[Aspect Hidden States]
        BiL --> OpH[Opinion Hidden States]
        AspH <--> CA[Cross Attention]
        OpH <--> CA
        CA --> AspL[Aspect Logits - BIO Tags]
        CA --> OpL[Opinion Logits - BIO Tags]
    end

    subgraph "Sentiment Classification Layer"
        AspL --> TriA[Triple Attention]
        OpL --> TriA
        Emb --> TriA
        TriA --> Fus[Fusion Layer]
        Fus --> SC[Sentiment Classifier]
        Fus --> Conf[Confidence Estimator]
        SC --> SL[Sentiment Logits]
        Conf --> CS[Confidence Scores]
    end

    subgraph "Generative Layer"
        AspL --> Ext[Triplet Extraction]
        OpL --> Ext
        SL --> Ext
        Ext --> Format[Prompt Formatting]
        Format --> Gen[Text Generator]
        Gen --> Sum[Natural Language Summary]
    end

    subgraph "Output"
        AspL --> Out[ABSA Output]
        OpL --> Out
        SL --> Out
        CS --> Out
        Sum --> Out
    end

    classDef novel fill:#f9d5e5,stroke:#333,stroke-width:1px;
    classDef component fill:#eeeeee,stroke:#333,stroke-width:1px;

    class CA,TriA,Gen,Format,Conf novel;
    class TL,BiL,AspH,OpH,AspL,OpL,SC,SL,CS,Ext,Sum component;


\`\`\`
`;export{n as default};
