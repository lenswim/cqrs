package zotte.dingen.cqrs.conversation;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import static zotte.dingen.cqrs.conversation.LineTestBuilder.aContextLine;
import static zotte.dingen.cqrs.conversation.LineTestBuilder.aSpeechLine;

public class ConversationTestBuilder {

    public static final LocalDateTime CREATED_ON = LocalDateTime.of(2016, 10, 12, 13, 32, 3);
    public static final LocalDate CONVERSATION_DATE = LocalDate.of(2016, 10, 12);

    private String id;
    private List<Line> lines = new ArrayList<>();
    private Line punchLine;
    private LocalDateTime createdOn;
    private LocalDate conversationDate;

    private ConversationTestBuilder() {
    }

    public static ConversationTestBuilder aConversation() {
        return new ConversationTestBuilder();
    }

    public static ConversationTestBuilder aDefaultConversation() {
        Line context = aContextLine().withText("context").build();
        Line punchLine = aSpeechLine().asPunchLine().withText("punch").withParticipants(new Participant("Gianni",false)).build();
        return aConversation()
                .withId(UUID.randomUUID().toString())
                .withCreatedOn(CREATED_ON)
                .withConversationDate(CONVERSATION_DATE)
                .withLines(context)
                .withPunchLine(punchLine);
    }

    public Conversation build() {
        List<Line> allLines = new ArrayList<>();
        allLines.addAll(lines);
        allLines.add(punchLine);
        return new Conversation(id, allLines, createdOn, conversationDate);
    }

    public ConversationTestBuilder withId(String id) {
        this.id = id;
        return this;
    }

    public ConversationTestBuilder withCreatedOn(LocalDateTime createdOn) {
        this.createdOn = createdOn;
        return this;
    }

    public ConversationTestBuilder withConversationDate(LocalDate conversationDate) {
        this.conversationDate = conversationDate;
        return this;
    }

    public ConversationTestBuilder withLines(List<Line> lines) {
        this.lines = lines;
        return this;
    }

    public ConversationTestBuilder withLines(Line... lines) {
        this.lines = Arrays.asList(lines);
        return this;
    }

    public ConversationTestBuilder withPunchLine(Line punchLine) {
        this.punchLine = punchLine;
        return this;
    }

    public ConversationTestBuilder withPunchLine(String punchLine) {
        this.punchLine = aContextLine().asPunchLine().withText(punchLine).build();
        return this;
    }
}