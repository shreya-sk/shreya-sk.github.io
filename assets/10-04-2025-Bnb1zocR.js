const e=`- Added [[../Documentation/Comprehensive Documentation|Comprehensive Documentation]]
- Changed from Microsoft-phi model to tinyllama due to space Constraints
- Added generative component

## TODO #todo

- [ ] Fix the ReadMe to include tinyllama
- [ ] fix the following issue: \`\`\`
\`\`\`(senti) (base) shreya@shreya MASCOT-2.0 % python evaluate.py --quicktest
Running quick test without a trained model
Traceback (most recent call last):
  File "/Users/shreya/Desktop/MASCOT-2.0/evaluate.py", line 479, in <module>
    quick_test()
  File "/Users/shreya/Desktop/MASCOT-2.0/evaluate.py", line 438, in quick_test
    model = GenerativeLLMABSA(config)
            ^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/Users/shreya/Desktop/MASCOT-2.0/src/models/absa.py", line 204, in __init__
    self.sentiment_classifier = AspectOpinionJointClassifier(...)
                                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
TypeError: AspectOpinionJointClassifier.__init__() missing 1 required positional argument: 'hidden_dim'\`\`\`
`;export{e as default};
