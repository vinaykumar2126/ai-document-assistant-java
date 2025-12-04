package com.example.ai_powered_document.service;
import org.springframework.stereotype.Service;
import dev.langchain4j.chain.ConversationalRetrievalChain;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.store.embedding.EmbeddingStore;
import dev.langchain4j.rag.content.retriever.ContentRetriever;
import dev.langchain4j.rag.content.retriever.EmbeddingStoreContentRetriever;

@Service
public class RagService {
     private final ConversationalRetrievalChain chain;
     public RagService(EmbeddingModel embeddingModel,EmbeddingStore store,ChatLanguageModel llm){
        ContentRetriever retriever = EmbeddingStoreContentRetriever.builder()
                .embeddingStore(store)
                .embeddingModel(embeddingModel)
                .build();
        this.chain = ConversationalRetrievalChain.builder()
            .contentRetriever(retriever)
            .chatLanguageModel(llm)
            .build();

     }
     public String ask(String question) {
        return chain.execute(question);
    }
}
